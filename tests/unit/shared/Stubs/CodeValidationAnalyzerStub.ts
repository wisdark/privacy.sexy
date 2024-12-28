import type { CodeLine, InvalidCodeLine, CodeValidationAnalyzer } from '@/application/Parser/Executable/Script/Validation/Analyzers/CodeValidationAnalyzer';
import type { ScriptingLanguage } from '@/domain/ScriptingLanguage';

export class CodeValidationAnalyzerStub {
  public readonly receivedLines = new Array<readonly CodeLine[]>();

  public readonly receivedLanguages = new Array<ScriptingLanguage>();

  private returnValue: InvalidCodeLine[] = [];

  public withReturnValue(lines: readonly InvalidCodeLine[]) {
    this.returnValue = [...lines];
    return this;
  }

  public get(): CodeValidationAnalyzer {
    return (lines, language) => {
      this.receivedLines.push(...[lines]);
      this.receivedLanguages.push(language);
      return this.returnValue;
    };
  }
}
