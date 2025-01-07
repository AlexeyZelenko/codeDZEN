import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";

export default defineNuxtPlugin((nuxtApp) => {
  const apolloClient = new ApolloClient({
    link: new HttpLink({
      uri: "http://localhost:8080/graphql", // Адрес вашего сервера GraphQL
    }),
    cache: new InMemoryCache(),
  });

  nuxtApp.vueApp.provide(DefaultApolloClient, apolloClient);
});
