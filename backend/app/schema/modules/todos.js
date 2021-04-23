const _ = require("lodash");
const db = require("../../db");
const { createResolver } = require("../resolvers");

const jmDefs = {
  Query: {
    fields: {
      todo: {
        where: (table, args, context) => `${table}.id = ${args.id}`
      },
      todos: {
        sqlPaginate: true,
        orderBy: { id: "ASC" }
      }
    }
  },
  Todo: {
    name: "Todo",
    sqlTable: "todos",
    uniqueKey: "id",
    fields: {
      createdAt: {
        sqlColumn: "created_at"
      },
      updatedAt: {
        sqlColumn: "updated_at"
      },
      user: {
        sqlJoin: (table, userTable) => `${table}.user_id = ${userTable}.id`,
        resolve: createResolver(g => g.parent.user)
      }
    }
  }
};

const resolvers = {
  Query: {
    todo: createResolver(g => g.join()),
    todos: createResolver(g => g.join())
  },

  Mutation: {
    createTodo: async (_, { input }) => {
      const todo = await db.todos.save({
        user_id: input.userId,
        title: input.title,
        completed: input.completed
      });
      const user = await db.users.findOne({ id: todo.user_id });
      return {
        userErrors: [],
        result: {
          ...todo,
          user
        }
      };
    },

    updateTodo: async (_, { input }) => {
      const { id } = input;
      let todo = await db.todos.findOne({ id });
      if (!todo) {
        return {
          userErrors: [
            {
              field: ["id"],
              message: "todo not found"
            }
          ]
        };
      }

      todo = await db.todos.update(id, {
        title: input.title,
        completed: input.completed
      });
      const user = await db.users.findOne({ id: todo.user_id });

      return {
        userErrors: [],
        result: {
          ...todo,
          user
        }
      };
    },

    deleteTodo: async (_, { id }) => {
      const todo = await db.todos.findOne({ id });
      if (!todo) {
        return {
          userErrors: [
            {
              field: ["id"],
              message: "todo not found"
            }
          ]
        };
      }
      await db.todos.del({ id });

      return {
        userErrors: [],
        result: true
      };
    }
  }
};

module.exports = { resolvers, jmDefs };
