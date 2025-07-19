import { useChainId } from "wagmi";
import scaffoldConfig from "~/scaffold.config";

export const useTargetNetwork = () => {
  const chainId = useChainId();
  const targetNetwork = scaffoldConfig.targetNetworks.find(network => network.id === chainId) || scaffoldConfig.targetNetworks[0];
  
  return {
    targetNetwork,
  };
};
