import type { FunctionData } from '@/application/collections/';
import { sequenceEqual } from '@/application/Common/Array';
import type { ISharedFunctionCollection } from '@/application/Parser/Executable/Script/Compiler/Function/ISharedFunctionCollection';
import type { SharedFunctionsParser } from '@/application/Parser/Executable/Script/Compiler/Function/SharedFunctionsParser';
import type { ILanguageSyntax } from '@/application/Parser/Executable/Script/Validation/Syntax/ILanguageSyntax';
import { SharedFunctionCollectionStub } from './SharedFunctionCollectionStub';

export function createSharedFunctionsParserStub() {
  const callHistory = new Array<{
    readonly functions: readonly FunctionData[],
    readonly syntax: ILanguageSyntax,
  }>();

  const setupResults = new Array<{
    readonly functions: readonly FunctionData[],
    readonly result: ISharedFunctionCollection,
  }>();

  const findResult = (
    functions: readonly FunctionData[],
  ): ISharedFunctionCollection | undefined => {
    return setupResults
      .find((result) => sequenceEqual(result.functions, functions))
      ?.result;
  };

  const parser: SharedFunctionsParser = (
    functions: readonly FunctionData[],
    syntax: ILanguageSyntax,
  ) => {
    callHistory.push({
      functions: Array.from(functions),
      syntax,
    });
    const result = findResult(functions);
    return result || new SharedFunctionCollectionStub();
  };

  const setup = (
    functions: readonly FunctionData[],
    result: ISharedFunctionCollection,
  ) => {
    setupResults.push({ functions, result });
  };

  return {
    parser,
    setup,
    callHistory,
  };
}
