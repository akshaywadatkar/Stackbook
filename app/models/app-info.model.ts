export interface AppInfoViewModel {
  name: string;
  packageName: string;
  version: string;
  versionCode: number;
  framework: string;
  language: string;
  stability: string;
  icon: any;
  developer?: string;
  targetSdk?: number;
  releaseNotes?: string;
  isExpanded: boolean;
}