const _ = require("lodash");
const db = require("../../db");
const { hashPassword } = require("../../utils");
const { createResolver, createProtectedResolver } = require("../resolvers");

const jmDefs = {
  Query: {
    fields: {
      user: {
        where: (table, args, context) => `${table}.id = ${args.id}`
      },
      users: {
        sqlPaginate: true,
        orderBy: { id: "ASC" }
      }
    }
  },
  User: {
    name: "User",
    sqlTable: "users",
    uniqueKey: "id",
    fields: {
      createdAt: {
        sqlColumn: "created_at"
      },
      updatedAt: {
        sqlColumn: "updated_at"
      },
      todos: {
        sqlPaginate: true,
        sqlJoin: (userTable, table) => `${userTable}."id" = ${table}."user_id"`,
        orderBy: {
          id: "ASC"
        }
      }
    }
  }
};

const resolvers = {
  Query: {
    user: createProtectedResolver("user", g => g.join()),
    users: createProtectedResolver("admin", g => g.join())
  },

  Mutation: {
    createUser: async (_, { input }) => {
      const user = await db.users.save({
        email: input.email,
        name: input.name,
        password: await hashPassword(input.password),
        role: "guest"
      });
      return {
        userErrors: [],
        result: user
      };
    },

    updateUser: async (_, { input }) => {
      const { id } = input;
      const user = await db.users.findOne({ id });
      if (!user) {
        return {
          userErrors: [
            {
              field: ["id"],
              message: "user not found"
            }
          ]
        };
      }
      const result = await db.users.update(id, { name: input.name });
      return {
        userErrors: [],
        result
      };
    }
  }
};

module.exports = { resolvers, jmDefs };
