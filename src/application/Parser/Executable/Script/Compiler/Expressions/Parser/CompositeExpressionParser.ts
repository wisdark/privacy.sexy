import { ParameterSubstitutionParser } from '../SyntaxParsers/ParameterSubstitutionParser';
import { WithParser } from '../SyntaxParsers/WithParser';
import type { IExpression } from '../Expression/IExpression';
import type { IExpressionParser } from './IExpressionParser';

const Parsers: readonly IExpressionParser[] = [
  new ParameterSubstitutionParser(),
  new WithParser(),
] as const;

export class CompositeExpressionParser implements IExpressionParser {
  public constructor(private readonly leafs: readonly IExpressionParser[] = Parsers) {
    if (!leafs.length) {
      throw new Error('missing leafs');
    }
  }

  public findExpressions(code: string): IExpression[] {
    return this.leafs.flatMap(
      (parser) => parser.findExpressions(code) || [],
    );
  }
}
