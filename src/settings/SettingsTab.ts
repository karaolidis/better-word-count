import { App, PluginSettingTab, Setting, ToggleComponent, TextComponent, Notice } from "obsidian";
import type BetterWordCount from "src/main";
import { addStatusBarSettings } from "./StatusBarSettings";

export default class BetterWordCountSettingsTab extends PluginSettingTab {
  constructor(app: App, private plugin: BetterWordCount) {
    super(app, plugin);
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();
    containerEl.createEl("h3", { text: "Better Word Count Settings" });

    // General Settings
    containerEl.createEl("h4", { text: "General Settings" });
    new Setting(containerEl)
      .setName("Collect Statistics")
      .setDesc(
        "Reload required for change to take effect. Turn on to start collecting daily statistics of your writing. Stored in the path specified below. This is required for counts of the day as well as total counts."
      )
      .addToggle((cb: ToggleComponent) => {
        cb.setValue(this.plugin.settings.collectStats);
        cb.onChange(async (value: boolean) => {
          this.plugin.settings.collectStats = value;
          await this.plugin.saveSettings();
        });
      });
    new Setting(containerEl)
      .setName("Don't Count Comments")
      .setDesc("Turn on if you don't want markdown comments to be counted.")
      .addToggle((cb: ToggleComponent) => {
        cb.setValue(this.plugin.settings.countComments);
        cb.onChange(async (value: boolean) => {
          this.plugin.settings.countComments = value;
          await this.plugin.saveSettings();
        });
      });
    new Setting(containerEl)
      .setName("Display Section Word Count")
      .setDesc("Turn on if you want to display section word counts next to headings.")
      .addToggle((cb: ToggleComponent) => {
        cb.setValue(this.plugin.settings.displaySectionCounts);
        cb.onChange(async (value: boolean) => {
          this.plugin.settings.displaySectionCounts = value;
          this.plugin.onDisplaySectionCountsChange();
          await this.plugin.saveSettings();
        });
      });
    new Setting(containerEl)
      .setName("Page Word Count")
      .setDesc("Set how many words count as one \"page\"")
      .addText((text: TextComponent) => {
        text.inputEl.type = "number";
        text
          .setPlaceholder("300")
          .setValue(String(this.plugin.settings.pageWords))
          .onChange(async (value: string) => {
            if (!isNaN(Number(value))) {
              this.plugin.settings.pageWords = parseInt(value);
              this.plugin.saveSettings();
            } else {
              new Notice("Please Input a Valid Number");
            }
          });
      });

    // Advanced Settings
    containerEl.createEl("h4", { text: "Advanced Settings" });
    new Setting(containerEl)
      .setName("Vault Stats File Path")
      .setDesc("Reload required for change to take effect. The location of the vault statistics file, relative to the vault root.")
      .addText((text: TextComponent) => {
        text
          .setPlaceholder(".obsidian/vault-stats.json")
          .setValue(this.plugin.settings.statsPath)
          .onChange(async (value: string) => {
            this.plugin.settings.statsPath = value ?? ".obsidian/vault-stats.json";
            await this.plugin.saveSettings();
          });
      });

    // Status Bar Settings
    addStatusBarSettings(this.plugin, containerEl);
  }
}
