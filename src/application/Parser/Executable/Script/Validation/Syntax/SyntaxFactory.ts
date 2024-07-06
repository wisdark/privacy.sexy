import { ScriptingLanguage } from '@/domain/ScriptingLanguage';
import { ScriptingLanguageFactory } from '@/application/Common/ScriptingLanguage/ScriptingLanguageFactory';
import type { ILanguageSyntax } from '@/application/Parser/Executable/Script/Validation/Syntax/ILanguageSyntax';
import { BatchFileSyntax } from './BatchFileSyntax';
import { ShellScriptSyntax } from './ShellScriptSyntax';
import type { ISyntaxFactory } from './ISyntaxFactory';

export class SyntaxFactory
  extends ScriptingLanguageFactory<ILanguageSyntax>
  implements ISyntaxFactory {
  constructor() {
    super();
    this.registerGetter(ScriptingLanguage.batchfile, () => new BatchFileSyntax());
    this.registerGetter(ScriptingLanguage.shellscript, () => new ShellScriptSyntax());
  }
}
