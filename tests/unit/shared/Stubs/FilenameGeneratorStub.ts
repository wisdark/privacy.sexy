import type { FilenameGenerator } from '@/infrastructure/CodeRunner/Creation/Filename/FilenameGenerator';
import type { ScriptFilenameParts } from '@/infrastructure/CodeRunner/Creation/ScriptFileCreator';
import { StubWithObservableMethodCalls } from './StubWithObservableMethodCalls';

export class FilenameGeneratorStub
  extends StubWithObservableMethodCalls<FilenameGenerator>
  implements FilenameGenerator {
  private filename = `[${FilenameGeneratorStub.name}]file-name-stub`;

  public generateFilename(scriptFileNameParts: ScriptFilenameParts): string {
    this.registerMethodCall({
      methodName: 'generateFilename',
      args: [scriptFileNameParts],
    });
    return this.filename;
  }

  public withFilename(filename: string): this {
    this.filename = filename;
    return this;
  }
}
