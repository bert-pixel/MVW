=== MVW QuickScan ===
Contributors: berthermans
Tags: shortcode, quiz, wizard
Requires at least: 5.9
Tested up to: 6.6
Requires PHP: 7.4
Stable tag: 1.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Embeds the Maatschappij van Welstand QuickScan question wizard on any page or post via a shortcode.

== Description ==

Use the `[mvw_quickscan]` shortcode to render the QuickScan question flow anywhere on your WordPress site. Styles and behavior are namespaced (`mvw-` prefixed classes inside a `.mvw-quickscan-wrap` container) so the plugin does not bleed into your theme's layout, and multiple instances of the shortcode can be placed on the same page.

The destinations for the outcome call-to-action buttons (contact, voorwaarden, aanvraag starten, and the three "meer over aanvragen" links) are configured under **Settings → MVW QuickScan** and can optionally be overridden per shortcode instance.

== Usage ==

Basic:

    [mvw_quickscan]

Overriding a CTA destination for a single instance (otherwise the value from Settings → MVW QuickScan is used):

    [mvw_quickscan contact_url="/neem-contact-op" voorwaarden_url="/voorwaarden" aanvraag_url="https://aanvragen.mvw.nl/Account/Login"]

Available shortcode attributes: `contact_url`, `voorwaarden_url`, `aanvraag_url`, `kerk_url`, `samenleving_url`, `onderwijs_url`.

== Installation ==

1. Upload the `mvw-quickscan` folder to `/wp-content/plugins/` (or upload the zipped plugin via Plugins → Add New → Upload Plugin).
2. Activate the plugin through the "Plugins" menu in WordPress.
3. Go to Settings → MVW QuickScan and fill in the CTA destination URLs.
4. Add the `[mvw_quickscan]` shortcode to any page or post.

== Changelog ==

= 1.1.0 =
* Add a Settings → MVW QuickScan admin page for managing all six CTA destination URLs.
* Sync the plugin's question flow, styling, and data with the latest QuickScan app: hint modal, question tooltips, outcome lists, and updated icons.

= 1.0.0 =
* Initial release.
