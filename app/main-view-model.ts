import { Observable } from '@nativescript/core';
import { AppAnalyzerService } from './services/app-analyzer.service';
import { AppInfoViewModel } from './models/app-info.model';

export class MainViewModel extends Observable {
  private _apps: AppInfoViewModel[] = [];
  private appAnalyzer: AppAnalyzerService;

  constructor() {
    super();
    this.appAnalyzer = new AppAnalyzerService();
    this.loadApps();
  }

  get apps(): AppInfoViewModel[] {
    return this._apps;
  }

  set apps(value: AppInfoViewModel[]) {
    if (this._apps !== value) {
      this._apps = value;
      this.notifyPropertyChange('apps', value);
    }
  }

  async loadApps() {
    try {
      const apps = await this.appAnalyzer.getInstalledApps();
      this.apps = apps.map(app => ({
        ...app,
        isExpanded: false
      }));
    } catch (error) {
      console.error('Error loading apps:', error);
    }
  }

  toggleExpand(args: { index: number }) {
    const app = this.apps[args.index];
    app.isExpanded = !app.isExpanded;
    this.notifyPropertyChange('apps', this.apps);
  }
}