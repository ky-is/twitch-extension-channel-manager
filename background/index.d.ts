declare function getStorageKey(channelName: string): string;
declare function isChannelDisabled(channelName: string): boolean;
declare function setChannelDisabled(channelName: string, disabled: boolean): void;
declare let currentChannel: string | undefined;
declare let activeTabId: number | undefined;
declare function updateIcon(disabled: boolean): void;
declare function setPrimaryTabId(tabId: number): void;
declare function resetTabState(): void;
declare function updateCurrentTabInWindow(): void;
