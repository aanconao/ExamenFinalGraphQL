import { GraphQLError } from "graphql";
import { RestaurantModel, type PhoneAPI } from "./types.ts";
import { Collection, ObjectId } from "mongodb";

type Context = {
  RestaurantCollection: Collection<RestaurantModel>;
};

type RestaurantIDParam = {
  id: string;
};

type addRestaurantParams = {
  name: string;
  direction: string;
  city: string;
  phoneNumber: string;
};

export const resolvers = {
  Restaurant: {
    id: (param: RestaurantModel): string => {
      return param._id!.toString();
    },
    /*time: async (paramas: RestaurantModel): Promise<string> => {
      const API_KEY = Deno.env.get("API_KEY");

      if (!API_KEY) {
        throw new Error("Problema con API kEY");
      }
      //const timezone = paramas.time;

      const url = `https://api.api-ninjas.com/v1/worldtime?lat=&long=$`;
      const data = await fetch(url, { headers: { "X-API-KEY": API_KEY } });
      if (data.status !== 200) throw new GraphQLError("Error en la url");

      const response: WorldTimeAPI = await data.json();

      if (!response) throw new GraphQLError("Error en la API de WorldTime");

      return response.datetime;
    },*/
  },
  Query: {
    getRestaurant: async (
      _: unknown,
      params: RestaurantIDParam,
      context: Context
    ): Promise<RestaurantModel | null> => {
      return await context.RestaurantCollection.findOne({
        _id: new ObjectId(params.id),
      });
    },

    getRestaurants: async (
      _: unknown,
      __: unknown,
      context: Context
    ): Promise<RestaurantModel[]> => {
      return await context.RestaurantCollection.find().toArray();
    },
  },

  Mutation: {
    deleteRestaurant: async (
      _: unknown,
      params: RestaurantIDParam,
      context: Context
    ): Promise<boolean> => {
      const { deletedCount } = await context.RestaurantCollection.deleteOne({
        _id: new ObjectId(params.id),
      });
      return deletedCount === 1;
    },

    addRestaurant: async (
      _: unknown,
      params: addRestaurantParams,
      context: Context
    ): Promise<RestaurantModel> => {
      const API_KEY = Deno.env.get("API_KEY");

      if (!API_KEY) {
        throw new Error("Problema con API key");
      }

      const { name, direction, city, phoneNumber } = params;
      const phoneExist = await context.RestaurantCollection.countDocuments({
        phoneNumber,
      });

      if (phoneExist >= 1) throw new Error("Telefono ya existe");
      const url = `https://api.api-ninjas.com/v1/validatephone?number=${phoneNumber}`;
      const data = await fetch(url, { headers: { "X-API-KEY": API_KEY } });
      if (data.status !== 200) throw new GraphQLError("Error en la url");

      const response: PhoneAPI = await data.json();
      if (!response.is_valid) throw new GraphQLError("Error en el response");

      const country = response.country;

      const { insertedId } = await context.RestaurantCollection.insertOne({
        name,
        direction,
        city,
        phoneNumber,
        country,
      });

      return {
        _id: insertedId,
        name,
        direction,
        phoneNumber,
        city,
        country,
      };
    },
  },
};
