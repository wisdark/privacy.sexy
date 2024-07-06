import { OperatingSystem } from '@/domain/OperatingSystem';
import type { Logger } from '@/application/Common/Log/Logger';
import type { WindowVariables } from '@/infrastructure/WindowVariables/WindowVariables';
import type { CodeRunner } from '@/application/CodeRunner/CodeRunner';
import type { Dialog } from '@/presentation/common/Dialog';
import type { ScriptDiagnosticsCollector } from '@/application/ScriptDiagnostics/ScriptDiagnosticsCollector';
import { LoggerStub } from './LoggerStub';
import { CodeRunnerStub } from './CodeRunnerStub';
import { DialogStub } from './DialogStub';
import { ScriptDiagnosticsCollectorStub } from './ScriptDiagnosticsCollectorStub';

export class WindowVariablesStub implements WindowVariables {
  public codeRunner?: CodeRunner = new CodeRunnerStub();

  public isRunningAsDesktopApplication: true | undefined = true;

  public os?: OperatingSystem = OperatingSystem.BlackBerryOS;

  public log?: Logger = new LoggerStub();

  public dialog?: Dialog = new DialogStub();

  public scriptDiagnosticsCollector?
  : ScriptDiagnosticsCollector = new ScriptDiagnosticsCollectorStub();

  public withScriptDiagnosticsCollector(
    scriptDiagnosticsCollector: ScriptDiagnosticsCollector,
  ): this {
    this.scriptDiagnosticsCollector = scriptDiagnosticsCollector;
    return this;
  }

  public withLog(log: Logger): this {
    this.log = log;
    return this;
  }

  public withDialog(dialog: Dialog): this {
    this.dialog = dialog;
    return this;
  }

  public withIsRunningAsDesktopApplication(isRunningAsDesktopApplication: true | undefined): this {
    this.isRunningAsDesktopApplication = isRunningAsDesktopApplication;
    return this;
  }

  public withOs(value: OperatingSystem | undefined): this {
    this.os = value;
    return this;
  }

  public withCodeRunner(value?: CodeRunner): this {
    this.codeRunner = value;
    return this;
  }
}
