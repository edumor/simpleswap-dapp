import { createConfig, http } from "wagmi";
import { wagmiConnectors } from "./wagmiConnectors";
import scaffoldConfig from "~/scaffold.config";

export const wagmiConfig = createConfig({
  chains: scaffoldConfig.targetNetworks,
  connectors: wagmiConnectors,
  transports: scaffoldConfig.targetNetworks.reduce(
    (transports, chain) => ({
      ...transports,
      [chain.id]: http(),
    }),
    {} as Record<number, ReturnType<typeof http>>,
  ),
});
