=== MVW QuickScan ===
Contributors: berthermans
Tags: shortcode, quiz, wizard
Requires at least: 5.9
Tested up to: 6.6
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Embeds the Maatschappij van Welstand QuickScan question wizard on any page or post via a shortcode.

== Description ==

Use the `[mvw_quickscan]` shortcode to render the QuickScan question flow anywhere on your WordPress site. Styles and behavior are namespaced (`mvw-` prefixed classes inside a `.mvw-quickscan-wrap` container) so the plugin does not bleed into your theme's layout, and multiple instances of the shortcode can be placed on the same page.

== Usage ==

Basic:

    [mvw_quickscan]

With custom CTA destinations:

    [mvw_quickscan contact_url="/neem-contact-op" voorwaarden_url="/voorwaarden" aanvraag_url="https://aanvragen.mvw.nl/Account/Login"]

== Installation ==

1. Upload the `mvw-quickscan` folder to `/wp-content/plugins/`.
2. Activate the plugin through the "Plugins" menu in WordPress.
3. Add the `[mvw_quickscan]` shortcode to any page or post.

== Changelog ==

= 1.0.0 =
* Initial release.
