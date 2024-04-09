// https://api.snaz.in/docs#steam

declare interface SnazzahAPI {
  /**
   * The profile's avatar image.
   * 
   * *(The docs didn't show if this is optional, so I went the safe route in assuming so.)*
   */
  avatar?: string | null;
  /**
   * The flag of the user's location, can be `null`.
   */
  flag?: string | null;
  /**
   * The user's location, can be `null`.
   */
  location?: string | null;
  /**
   * The profile's avatar border, can be `null` if there is no border.
   */
  avatar_border_url?: string | null;
  /**
   * The profile's background image, can be `null` if there is no background.
   */
  background_url?: string | null;
  /**
   * The profile's animated background URL, can be `null` if the background is not animated.
   */
  animated_background_url?: string | null;
  /**
   * The profile's favorite badge, can be `null`.
   */
  badge?: {
    /**
     * The meta text of the badge, can be `null` if it is a Steam badge.
     */
    meta?: string | null;
  } | null;
  /**
   * The user's primary group, can be `null`.
   */
  primary_group?: object;
  /**
   * All keys in counts can be `null`. These keys are: `awards`, `badges`, `games`, `groups`, `reviews`, `friends`, `screenshots`, `workshop_files`, `guides`, `artwork`, `videos`.
   */
  counts: {
    [K in "awards" | "badges" | "games" | "groups" | "reviews" | "friends" | "screenshots" | "workshop_files" | "guides" | "artwork" | "videos"]?: {
      estimate: string;
      formatted: string;
      value: number;
    } | null;
  };
  /**
   * Recent activity, can be `null`.
   */
  recent_activity?: {
    games: {
      /**
       * The achievement progress in said game, can be `null` if the game does not have achievements.
       */
      achievement_progress?: Record<string, any> | null;
      /**
       * Either a date (like "Mar 26") or "in-game".
       */
      last_played: string;
    }[];
  } | null;
  bans: {
    /**
     * The amount of days since last ban.
     */
    days_since_last?: number;
    /**
     * The amount of bans the user has.
     */
    game: "none" | "one" | "multiple";
    /**
     * The amount of bans the user has.
     */
    vac: "none" | "one" | "multiple";
  };
  status: {
    /**
     * Available states: `offline`, `online`, `in-game`.
     */
    state: "offline" | "online" | "in-game";
    /**
     * The name of the game the user is playing if they are `in-game`.
     */
    game?: string;
    /**
     * The IP of the server they are playing if their game is joinable.
     */
    server_ip?: string;
  };
  username: string;
}