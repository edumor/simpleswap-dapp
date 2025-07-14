import { TransactionReceipt } from "viem";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { ObjectFieldDisplay } from "~~/app/debug/_components/contract";
import { useCopyToClipboard } from "~~/hooks/scaffold-eth/useCopyToClipboard";
import { replacer } from "~~/utils/scaffold-eth/common";

export const TxReceipt = ({ txResult }: { txResult: TransactionReceipt }) => {
  const { copyToClipboard: copyTxResultToClipboard, isCopiedToClipboard: isTxResultCopiedToClipboard } =
    useCopyToClipboard();
  const { copyToClipboard: copyHashToClipboard, isCopiedToClipboard: isHashCopiedToClipboard } = useCopyToClipboard();

  // El hash puede llamarse transactionHash o hash según la red/lib
  const txHash = (txResult as any).transactionHash || (txResult as any).hash;

  return (
    <div className="flex flex-col text-sm rounded-3xl peer-checked:rounded-b-none min-h-0 bg-secondary py-0">
      {txHash && (
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <span className="font-bold text-base-content">Tx Hash:</span>
          <span className="font-mono text-xs break-all text-primary">{txHash}</span>
          {isHashCopiedToClipboard ? (
            <CheckCircleIcon className="text-xl text-success h-5 w-5 cursor-pointer" aria-hidden="true" />
          ) : (
            <DocumentDuplicateIcon
              className="text-xl h-5 w-5 cursor-pointer"
              aria-hidden="true"
              onClick={() => copyHashToClipboard(txHash)}
            />
          )}
        </div>
      )}
      <div className="flex">
        <div className="mt-1 pl-2">
          {isTxResultCopiedToClipboard ? (
            <CheckCircleIcon
              className="ml-1.5 text-xl font-normal text-base-content h-5 w-5 cursor-pointer"
              aria-hidden="true"
            />
          ) : (
            <DocumentDuplicateIcon
              className="ml-1.5 text-xl font-normal h-5 w-5 cursor-pointer"
              aria-hidden="true"
              onClick={() => copyTxResultToClipboard(JSON.stringify(txResult, replacer, 2))}
            />
          )}
        </div>
        <div tabIndex={0} className="flex-wrap collapse collapse-arrow w-full">
          <input type="checkbox" className="min-h-0! peer" />
          <div className="collapse-title text-sm min-h-0! py-1.5 pl-1 after:top-4!">
            <strong>Transaction Receipt</strong>
          </div>
          <div className="collapse-content overflow-auto bg-secondary rounded-t-none rounded-3xl pl-0!">
            <pre className="text-xs">
              {Object.entries(txResult).map(([k, v]) => (
                <ObjectFieldDisplay name={k} value={v} size="xs" leftPad={false} key={k} />
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
