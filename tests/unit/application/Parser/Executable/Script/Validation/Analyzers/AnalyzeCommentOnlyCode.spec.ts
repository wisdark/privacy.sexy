import { describe, it } from 'vitest';
import { analyzeCommentOnlyCode, type CommentOnlyCodeAnalyzer } from '@/application/Parser/Executable/Script/Validation/Analyzers/AnalyzeCommentOnlyCode';
import type { CommentLineChecker } from '@/application/Parser/Executable/Script/Validation/Analyzers/Common/CommentLineChecker';
import type { SyntaxFactory } from '@/application/Parser/Executable/Script/Validation/Analyzers/Syntax/SyntaxFactory';
import { ScriptingLanguage } from '@/domain/ScriptingLanguage';
import type { CodeLine, InvalidCodeLine } from '@/application/Parser/Executable/Script/Validation/Analyzers/CodeValidationAnalyzer';
import { CommentLineCheckerStub } from '@tests/unit/shared/Stubs/CommentLineCheckerStub';
import { SyntaxFactoryStub } from '@tests/unit/shared/Stubs/SyntaxFactoryStub';
import { LanguageSyntaxStub } from '@tests/unit/shared/Stubs/LanguageSyntaxStub';
import { createCodeLines } from './CreateCodeLines';
import { expectSameInvalidCodeLines } from './ExpectSameInvalidCodeLines';

describe('AnalyzeCommentOnlyCode', () => {
  describe('analyzeCommentOnlyCode', () => {
    it('returns empty given no match', () => {
      // arrange
      const context = setupScenario({
        givenLines: ['line-1', 'line-2', 'line-3'],
        matchedLines: [],
      });
      // act
      const actualResult = context.analyze();
      // assert
      expect(actualResult).to.have.lengthOf(0);
    });
    it('returns empty given some matches', () => {
      // arrange
      const context = setupScenario({
        givenLines: ['line-1', 'line-2'],
        matchedLines: [],
      });
      // act
      const actualResult = context.analyze();
      // assert
      expect(actualResult).to.have.lengthOf(0);
    });
    it('returns all lines given all match', () => {
      // arrange
      const lines = ['line-1', 'line-2', 'line-3'];
      const expectedResult: InvalidCodeLine[] = lines
        .map((_line, index): InvalidCodeLine => ({
          lineNumber: index + 1,
          error: 'Code consists of comments only',
        }));
      const context = setupScenario({
        givenLines: lines,
        matchedLines: lines,
      });
      // act
      const actualResult = context.analyze();
      // assert
      expectSameInvalidCodeLines(expectedResult, actualResult);
    });
    it('uses correct language for syntax creation', () => {
      // arrange
      const expectedLanguage = ScriptingLanguage.batchfile;
      let actualLanguage: ScriptingLanguage | undefined;
      const factory: SyntaxFactory = (language) => {
        actualLanguage = language;
        return new LanguageSyntaxStub();
      };
      const context = new TestContext()
        .withLanguage(expectedLanguage)
        .withSyntaxFactory(factory);
      // act
      context.analyze();
      // assert
      expect(actualLanguage).to.equal(expectedLanguage);
    });
  });
});

interface CommentOnlyCodeAnalysisTestScenario {
  readonly givenLines: readonly string[];
  readonly matchedLines: readonly string[];
}

function setupScenario(
  scenario: CommentOnlyCodeAnalysisTestScenario,
): TestContext {
  // arrange
  const lines = scenario.givenLines;
  const syntax = new LanguageSyntaxStub();
  const checker = new CommentLineCheckerStub();
  scenario.matchedLines.forEach((line) => checker.withPredeterminedResult({
    givenLine: line,
    givenSyntax: syntax,
    result: true,
  }));
  return new TestContext()
    .withSyntaxFactory(() => syntax)
    .withLines(lines)
    .withCommentLineChecker(checker.get());
}

export class TestContext {
  private codeLines: readonly CodeLine[] = createCodeLines(['test-code-line']);

  private language = ScriptingLanguage.batchfile;

  private syntaxFactory: SyntaxFactory = new SyntaxFactoryStub().get();

  private commentLineChecker: CommentLineChecker = new CommentLineCheckerStub().get();

  public withLines(lines: readonly string[]): this {
    this.codeLines = createCodeLines(lines);
    return this;
  }

  public withLanguage(language: ScriptingLanguage): this {
    this.language = language;
    return this;
  }

  public withSyntaxFactory(syntaxFactory: SyntaxFactory): this {
    this.syntaxFactory = syntaxFactory;
    return this;
  }

  public withCommentLineChecker(commentLineChecker: CommentLineChecker): this {
    this.commentLineChecker = commentLineChecker;
    return this;
  }

  public analyze(): ReturnType<CommentOnlyCodeAnalyzer> {
    return analyzeCommentOnlyCode(
      this.codeLines,
      this.language,
      this.syntaxFactory,
      this.commentLineChecker,
    );
  }
}
