# frozen_string_literal: true

module Jekyll
  # Loads the public GA4 measurement ID from the deployment environment while
  # retaining _config.yml as a convenient local-development fallback.
  class AnalyticsConfigGenerator < Generator
    safe true
    priority :highest

    MEASUREMENT_ID_PATTERN = /\AG-[A-Z0-9]+\z/i

    def generate(site)
      site.config["analytics"] ||= {}

      configured_id = site.config.dig("analytics", "google_id").to_s.strip
      environment_id = ENV.fetch("GOOGLE_ANALYTICS_ID", "").strip
      measurement_id = environment_id.empty? ? configured_id : environment_id

      return site.config["analytics"]["google_id"] = "" if measurement_id.empty?

      unless measurement_id.match?(MEASUREMENT_ID_PATTERN)
        Jekyll.logger.warn(
          "Analytics:",
          "ignoring invalid GA4 measurement ID (expected a value such as G-ABC123DEF4)"
        )
        return site.config["analytics"]["google_id"] = ""
      end

      site.config["analytics"]["google_id"] = measurement_id.upcase
    end
  end
end
