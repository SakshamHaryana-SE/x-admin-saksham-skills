import {
  AdminContext,
  AdminUI,
  Resource,
  useDataProvider,
  useRedirect,
} from "react-admin";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import buildHasuraProvider, { buildFields } from "ra-data-hasura";
import { useEffect, useState } from "react";

import { MuiThemeProvider } from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core/styles';
import customFields from "./customHasura/customFields";
import customLayout from "./layout/";
import customTheme from "./theme";
import customVariables from "./customHasura/customVariables";
import resourceConfig from "./layout/config";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

const App = () => {
  const [dataProvider, setDataProvider] = useState(null);
  const [apolloClient, setApolloClient] = useState(null);
  const router = useRouter();
  const [session] = useSession();

  useEffect(() => {
    const hasuraHeaders = {};
    hasuraHeaders.Authorization = `Bearer ${session.jwt}`;
    if (session.role) hasuraHeaders["x-hasura-role"] = session.role;

    let tempClient = new ApolloClient({
      uri: process.env.NEXT_PUBLIC_HASURA_URL,
      cache: new InMemoryCache(),
      headers: hasuraHeaders,
    });

    async function buildDataProvider() {
      try {
        const hasuraProvider = await buildHasuraProvider(
          { client: tempClient },
          {
            buildFields: customFields,
          },
          customVariables
        );

        setDataProvider(() => hasuraProvider);
        setApolloClient(tempClient);
      } catch (e) {
        console.log("Error catch:", e);
        if (!router.isFallback) {
          router.push("/");
        }
      }
    }
    buildDataProvider();
  }, [session]);

  if (!dataProvider || !apolloClient) {
    return null;
  }
  return (
    <AdminContext dataProvider={dataProvider}>
      <AsyncResources client={apolloClient} />
    </AdminContext>
  );
};
function AsyncResources({ client }) {
  const [session] = useSession();
  let introspectionResultObjects =
    client.cache?.data?.data?.ROOT_QUERY?.__schema.types
      ?.filter((obj) => obj.kind === "OBJECT")
      ?.map((elem) => elem.name);
  const resources = resourceConfig();
  let filteredResources = resources;

  if (introspectionResultObjects) {
    filteredResources = resources.filter((elem) =>
      introspectionResultObjects.includes(elem.name)
    );
  }
  if (!resources) return null;

  return (
    <MuiThemeProvider theme={createMuiTheme(customTheme)}>
      <AdminUI disablloginPageeTelemetry={false} layout={customLayout}>
        {filteredResources.map((resource) => (
          <Resource
            key={resource.name}
            name={resource.name}
            list={resource.list}
            edit={resource.edit}
            create={resource.create}
            show={resource.show}
          />
        ))}
      </AdminUI>
    </MuiThemeProvider>
  );
}

export default App;
