// https://lanyard.eggsy.xyz/api/getting-user-presence

declare interface LanyardAPI {
      kv: {
        lanyardOwner: string;
      };
      spotify: {
        album_art_url: string;
        album: string;
      } | null;
      discord_user: {
        id: string;
        username: string;
        avatar: string;
        discriminator: string;
        bot: boolean;
        global_name: number;
        avatar_decoration_data: object | null; // not typed yet, replace `object`
        display_name: number;
        public_flags: number;
      };
      activities: LanyardActivity[];
      discord_status: "online" | "dnd" | "idle" | "offline";
      active_on_discord_web: boolean;
      active_on_discord_desktop: boolean;
      active_on_discord_mobile: boolean;
      listening_to_spotify: boolean;
    };
    success: boolean;
  
  declare type LanyardActivity = LanyardActivityLike | LanyardActivity4;
  
  declare interface LanyardActivityLike {
    name: string;
    type: number;
    application_id: string;
    state: string;
    // for hang statuses.
    emoji?: {
      id: string;
      name: string;
      animated: boolean;
    };
    details?: string;
    assets?: {
      small_image: string;
      small_text: string;
      large_image: string;
      large_text: string;
    };
    timestamps: {
      start: number;
    };
  }
  
  declare interface LanyardActivity4 extends LanyardActivityLike {
    type: 4;
  
    // not completely sure about it being specifically a `string`.
    // just an educated guess
    state: string;
  }
  
  declare type LanyardLang<K extends keyof LanyardLangNameMap = keyof LanyardLangNameMap> = LanyardLangNameMap[K];
  
  declare interface LanyardLangNameMap {
    "en-US": typeof import("../assets/lang/en-US.json");
    "zh-CN": typeof import("../assets/lang/zh-CN.json");
  }
  
  declare interface LocalizedText<K extends keyof LanyardLangNameMap = keyof LanyardLangNameMap> {
    lyonline: LanyardLang<K>["OnlineText"];
    lydnd: LanyardLang<K>["DoNotDisturbText"];
    lyidle: LanyardLang<K>["IdleText"];
    lyoffline: LanyardLang<K>["OfflineText"];
    lyunknown: LanyardLang<K>["UnknownText"];
    lypin: LanyardLang<K>["PlatformsInUseText"];
    lyplatm: LanyardLang<K>["PlatformMobile"];
    lyplatd: LanyardLang<K>["PlatformDesktop"];
    lyplatw: LanyardLang<K>["PlatformWeb"];
    lytimee: LanyardLang<K>["TimeElapsedText"];
    lyna: LanyardLang<K>["NoActivityText"];
  }