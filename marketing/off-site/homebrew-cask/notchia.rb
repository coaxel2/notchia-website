cask "notchia" do
  version "2.8.0"
  sha256 "TODO_CALCULATE_AFTER_DOWNLOAD"

  # Canonical, versioned URL is preferred by Homebrew over a generic redirect.
  # `version :latest` is discouraged for stable casks: pin to a real release.
  url "https://github.com/coaxel2/NotchIA/releases/download/v#{version}/NotchIA.dmg",
      verified: "github.com/coaxel2/NotchIA/"

  name "NotchIA"
  desc "Turns the MacBook notch into an AI productivity cockpit"
  homepage "https://notchia.app/"

  livecheck do
    url :url
    strategy :github_latest
  end

  # Sparkle handles in-app auto-updates (EdDSA-signed appcast over HTTPS).
  auto_updates true

  # macOS 15 Sequoia is the minimum supported OS.
  depends_on macos: ">= :sequoia"

  app "NotchIA.app"

  zap trash: [
    "~/Library/Application Support/NotchIA",
    "~/Library/Caches/com.coaxel2.notchia",
    "~/Library/HTTPStorages/com.coaxel2.notchia",
    "~/Library/Preferences/com.coaxel2.notchia.plist",
    "~/Library/Saved Application State/com.coaxel2.notchia.savedState",
    "~/Library/WebKit/com.coaxel2.notchia",
  ]
end
