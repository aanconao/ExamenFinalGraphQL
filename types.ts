import { OptionalId } from "mongodb";

export type RestaurantModel = OptionalId<{
  name: string;
  direction: string;
  city: string;
  country: string;
  phoneNumber: string;
}>;

// https://api.api-ninjas.com/v1/validatephone?number=
export type PhoneAPI = {
  is_valid: boolean;
  country: string;
  timezone: string[];
};

//
export type WorldTimeAPI = {
  datetime: string;
};
