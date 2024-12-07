import { Application, Device, Utils } from '@nativescript/core';

export interface AppInfo {
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
}

export class AppAnalyzerService {
  async getInstalledApps(): Promise<AppInfo[]> {
    if (global.isAndroid) {
      return this.getAndroidApps();
    } else if (global.isIOS) {
      return this.getIOSApps();
    }
    return [];
  }

  private async getAndroidApps(): Promise<AppInfo[]> {
    const context = Utils.android.getApplicationContext();
    const packageManager = context.getPackageManager();
    const packages = packageManager.getInstalledPackages(0);
    const apps: AppInfo[] = [];

    for (let i = 0; i < packages.size(); i++) {
      const packageInfo = packages.get(i);
      if ((packageInfo.applicationInfo.flags & android.content.pm.ApplicationInfo.FLAG_SYSTEM) === 0) {
        try {
          const appInfo: AppInfo = {
            name: packageInfo.applicationInfo.loadLabel(packageManager).toString(),
            packageName: packageInfo.packageName,
            version: packageInfo.versionName,
            versionCode: packageInfo.versionCode,
            framework: this.detectFramework(packageInfo),
            language: this.detectLanguage(packageInfo),
            stability: 'Stable',
            icon: packageInfo.applicationInfo.loadIcon(packageManager),
            targetSdk: packageInfo.applicationInfo.targetSdkVersion
          };
          apps.push(appInfo);
        } catch (error) {
          console.error('Error processing app:', error);
        }
      }
    }
    return apps;
  }

  private async getIOSApps(): Promise<AppInfo[]> {
    // iOS doesn't provide API to get installed apps info due to sandbox restrictions
    return [{
      name: 'Current App',
      packageName: NSBundle.mainBundle.bundleIdentifier,
      version: NSBundle.mainBundle.infoDictionary.objectForKey('CFBundleShortVersionString'),
      versionCode: 1,
      framework: 'NativeScript',
      language: 'TypeScript',
      stability: 'Stable',
      icon: null
    }];
  }

  private detectFramework(packageInfo: android.content.pm.PackageInfo): string {
    // This is a simplified detection logic
    const nativeLibs = packageInfo.applicationInfo.nativeLibraryDir;
    if (nativeLibs.includes('flutter')) {
      return 'Flutter';
    } else if (nativeLibs.includes('react')) {
      return 'React Native';
    } else {
      return 'Native Android';
    }
  }

  private detectLanguage(packageInfo: android.content.pm.PackageInfo): string {
    // Simplified language detection
    const nativeLibs = packageInfo.applicationInfo.nativeLibraryDir;
    if (nativeLibs.includes('flutter')) {
      return 'Dart';
    } else if (nativeLibs.includes('react')) {
      return 'JavaScript/TypeScript';
    } else {
      return 'Kotlin/Java';
    }
  }
}