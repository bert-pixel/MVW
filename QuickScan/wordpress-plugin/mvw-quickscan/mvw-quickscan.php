<?php
/**
 * Plugin Name: MVW QuickScan
 * Description: Embeds the Maatschappij van Welstand QuickScan vragenboom on any page via the [mvw_quickscan] shortcode. CTA destinations are configurable under Settings → MVW QuickScan.
 * Version: 1.1.0
 * Author: Bert Hermans
 * License: GPL-2.0-or-later
 * Text Domain: mvw-quickscan
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

define( 'MVW_QUICKSCAN_VERSION', '1.1.0' );
define( 'MVW_QUICKSCAN_HANDLE', 'mvw-quickscan' );
define( 'MVW_QUICKSCAN_OPTION', 'mvw_quickscan_cta_urls' );

/**
 * Default CTA destinations, used whenever a setting hasn't been configured yet.
 */
function mvw_quickscan_get_cta_defaults() {
	return array(
		'contact'           => '/contact',
		'bekijk_voorwaarden' => '/donatie-aanvragen',
		'start_aanvraag'    => 'https://aanvragen.mvw.nl/Account/Login',
		'zie_kerk'          => '/donatie-aanvragen/donatie-aanvragen-kerk/',
		'zie_samenleving'   => '/donatie-aanvragen/donatie-aanvragen-samenleving/',
		'zie_onderwijs'     => '/donatie-aanvragen/donatie-aanvragen-onderwijs/',
	);
}

/**
 * Human-readable labels for each CTA URL field, used on the settings page.
 */
function mvw_quickscan_get_cta_labels() {
	return array(
		'contact'           => __( 'Neem contact op', 'mvw-quickscan' ),
		'bekijk_voorwaarden' => __( 'Bekijk voorwaarden', 'mvw-quickscan' ),
		'start_aanvraag'    => __( 'Start aanvraag', 'mvw-quickscan' ),
		'zie_kerk'          => __( 'Meer over aanvragen en voorwaarden — Kerk en geloof', 'mvw-quickscan' ),
		'zie_samenleving'   => __( 'Meer over aanvragen en voorwaarden — Samenleving', 'mvw-quickscan' ),
		'zie_onderwijs'     => __( 'Meer over aanvragen en voorwaarden — Onderwijs', 'mvw-quickscan' ),
	);
}

/**
 * Get the configured CTA URLs, falling back to defaults for any missing values.
 */
function mvw_quickscan_get_cta_urls() {
	$stored = get_option( MVW_QUICKSCAN_OPTION, array() );
	if ( ! is_array( $stored ) ) {
		$stored = array();
	}
	return wp_parse_args( $stored, mvw_quickscan_get_cta_defaults() );
}

/**
 * Sanitize the CTA URL settings before they're saved.
 */
function mvw_quickscan_sanitize_cta_urls( $input ) {
	$defaults = mvw_quickscan_get_cta_defaults();
	$output   = array();

	foreach ( $defaults as $key => $default_value ) {
		if ( isset( $input[ $key ] ) && '' !== trim( $input[ $key ] ) ) {
			$output[ $key ] = esc_url_raw( trim( $input[ $key ] ) );
		} else {
			$output[ $key ] = $default_value;
		}
	}

	return $output;
}

/**
 * Register the plugin settings (Settings API).
 */
function mvw_quickscan_register_settings() {
	register_setting(
		'mvw_quickscan_settings_group',
		MVW_QUICKSCAN_OPTION,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'mvw_quickscan_sanitize_cta_urls',
			'default'           => mvw_quickscan_get_cta_defaults(),
		)
	);

	add_settings_section(
		'mvw_quickscan_cta_section',
		__( 'CTA-bestemmingen', 'mvw-quickscan' ),
		function () {
			echo '<p>' . esc_html__( 'Stel de doel-URL\'s in voor de call-to-action knoppen die aan het einde van de QuickScan worden getoond.', 'mvw-quickscan' ) . '</p>';
		},
		'mvw_quickscan_settings'
	);

	foreach ( mvw_quickscan_get_cta_labels() as $key => $label ) {
		add_settings_field(
			'mvw_quickscan_' . $key,
			$label,
			'mvw_quickscan_render_url_field',
			'mvw_quickscan_settings',
			'mvw_quickscan_cta_section',
			array( 'key' => $key )
		);
	}
}
add_action( 'admin_init', 'mvw_quickscan_register_settings' );

/**
 * Render a single URL settings field.
 */
function mvw_quickscan_render_url_field( $args ) {
	$key      = $args['key'];
	$urls     = mvw_quickscan_get_cta_urls();
	$value    = isset( $urls[ $key ] ) ? $urls[ $key ] : '';
	$field_id = 'mvw_quickscan_' . $key;
	?>
	<input
		type="text"
		id="<?php echo esc_attr( $field_id ); ?>"
		name="<?php echo esc_attr( MVW_QUICKSCAN_OPTION ); ?>[<?php echo esc_attr( $key ); ?>]"
		value="<?php echo esc_attr( $value ); ?>"
		class="regular-text"
	/>
	<?php
}

/**
 * Register the "MVW QuickScan" settings page under Settings.
 */
function mvw_quickscan_register_settings_page() {
	add_options_page(
		__( 'MVW QuickScan', 'mvw-quickscan' ),
		__( 'MVW QuickScan', 'mvw-quickscan' ),
		'manage_options',
		'mvw-quickscan-settings',
		'mvw_quickscan_render_settings_page'
	);
}
add_action( 'admin_menu', 'mvw_quickscan_register_settings_page' );

/**
 * Render the settings page.
 */
function mvw_quickscan_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'MVW QuickScan', 'mvw-quickscan' ); ?></h1>
		<p><?php esc_html_e( 'Deze instellingen bepalen waar de call-to-action knoppen in de [mvw_quickscan] shortcode naartoe verwijzen.', 'mvw-quickscan' ); ?></p>
		<form action="options.php" method="post">
			<?php
			settings_fields( 'mvw_quickscan_settings_group' );
			do_settings_sections( 'mvw_quickscan_settings' );
			submit_button();
			?>
		</form>
	</div>
	<?php
}

/**
 * Add a "Settings" link on the Plugins list page.
 */
function mvw_quickscan_plugin_action_links( $links ) {
	$settings_link = '<a href="' . esc_url( admin_url( 'options-general.php?page=mvw-quickscan-settings' ) ) . '">' . esc_html__( 'Settings', 'mvw-quickscan' ) . '</a>';
	array_unshift( $links, $settings_link );
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'mvw_quickscan_plugin_action_links' );

/**
 * Register and enqueue the plugin's CSS/JS assets.
 * Assets are only enqueued when the shortcode is actually rendered,
 * via wp_enqueue in the shortcode callback (see mvw_quickscan_shortcode()).
 */
function mvw_quickscan_register_assets() {
	wp_register_style(
		MVW_QUICKSCAN_HANDLE,
		plugins_url( 'assets/css/quickscan.css', __FILE__ ),
		array(),
		MVW_QUICKSCAN_VERSION
	);

	wp_register_style(
		'mvw-quickscan-material-icons',
		'https://fonts.googleapis.com/icon?family=Material+Icons',
		array(),
		null
	);

	wp_register_script(
		MVW_QUICKSCAN_HANDLE,
		plugins_url( 'assets/js/quickscan-app.mjs', __FILE__ ),
		array(),
		MVW_QUICKSCAN_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'mvw_quickscan_register_assets' );

/**
 * The script is a native ES module (it uses `import`), so it must be
 * output with type="module" rather than WordPress's default type="text/javascript".
 */
function mvw_quickscan_script_module_tag( $tag, $handle, $src ) {
	if ( MVW_QUICKSCAN_HANDLE !== $handle ) {
		return $tag;
	}
	return '<script type="module" src="' . esc_url( $src ) . '"></script>';
}
add_filter( 'script_loader_tag', 'mvw_quickscan_script_module_tag', 10, 3 );

/**
 * [mvw_quickscan] shortcode.
 *
 * Attributes (all optional; each overrides the corresponding CTA destination
 * configured under Settings → MVW QuickScan, for this shortcode instance only):
 *   contact_url       - "Neem contact op" destination
 *   voorwaarden_url    - "Bekijk voorwaarden" destination
 *   aanvraag_url        - "Start aanvraag" destination
 *   kerk_url            - "Kerk en geloof" outcome CTA destination
 *   samenleving_url     - "Samenleving" outcome CTA destination
 *   onderwijs_url        - "Levensbeschouwelijk onderwijs" outcome CTA destination
 */
function mvw_quickscan_shortcode( $atts ) {
	$cta_urls = mvw_quickscan_get_cta_urls();

	$atts = shortcode_atts(
		array(
			'contact_url'     => $cta_urls['contact'],
			'voorwaarden_url' => $cta_urls['bekijk_voorwaarden'],
			'aanvraag_url'    => $cta_urls['start_aanvraag'],
			'kerk_url'        => $cta_urls['zie_kerk'],
			'samenleving_url' => $cta_urls['zie_samenleving'],
			'onderwijs_url'   => $cta_urls['zie_onderwijs'],
		),
		$atts,
		'mvw_quickscan'
	);

	wp_enqueue_style( MVW_QUICKSCAN_HANDLE );
	wp_enqueue_style( 'mvw-quickscan-material-icons' );
	wp_enqueue_script( MVW_QUICKSCAN_HANDLE );

	ob_start();
	?>
	<div
		class="mvw-quickscan-wrap"
		data-mvw-quickscan
		data-contact-url="<?php echo esc_attr( esc_url_raw( $atts['contact_url'] ) ); ?>"
		data-voorwaarden-url="<?php echo esc_attr( esc_url_raw( $atts['voorwaarden_url'] ) ); ?>"
		data-aanvraag-url="<?php echo esc_attr( esc_url_raw( $atts['aanvraag_url'] ) ); ?>"
		data-kerk-url="<?php echo esc_attr( esc_url_raw( $atts['kerk_url'] ) ); ?>"
		data-samenleving-url="<?php echo esc_attr( esc_url_raw( $atts['samenleving_url'] ) ); ?>"
		data-onderwijs-url="<?php echo esc_attr( esc_url_raw( $atts['onderwijs_url'] ) ); ?>"
	>
		<div class="mvw-main">
			<div class="mvw-section">
				<div class="mvw-container">
					<div class="mvw-article">
						<div class="mvw-article-header">
							<div class="mvw-header-content">
								<div class="mvw-view-toggle">
									<button type="button" class="mvw-toggle-btn" data-view="list" title="List view">
										<span class="material-icons">view_list</span>
										<span>Lijst</span>
									</button>
									<button type="button" class="mvw-toggle-btn mvw-active" data-view="card" title="Card view">
										<span class="material-icons">apps</span>
										<span>Kaart</span>
									</button>
								</div>
							</div>
						</div>
					</div>

					<template class="mvw-progress-template">
						<div class="mvw-progress-bar">
							<div class="mvw-progress-steps"></div>
						</div>
					</template>

					<template class="mvw-question-template">
						<div class="mvw-question-card">
							<div class="mvw-question-header">
								<h2 class="mvw-question-title"></h2>
							</div>
							<div class="mvw-question-options"></div>
						</div>
					</template>

					<template class="mvw-outcome-template">
						<div class="mvw-outcome-card">
							<span class="mvw-outcome-icon material-icons"></span>
							<h2 class="mvw-outcome-title"></h2>
							<p class="mvw-outcome-body"></p>
							<ul class="mvw-outcome-list"></ul>
							<p class="mvw-outcome-post"></p>
							<div class="mvw-outcome-ctas"></div>
						</div>
					</template>

					<div class="mvw-app"></div>
          <p class="mvw-disclaimer">
            <strong>Let op:</strong> deze quickscan is alleen een richtlijn of
            de aanvraag voldoet aan de basiscriteria van Maatschappij van
            Welstand. Aan de uitkomst kun je geen rechten ontlenen en het is
            geen garantie dat de aan te vragen financiële bijdrage ook wordt
            toegekend.
          </p>
				</div>
			</div>
		</div>
	</div>
	<?php
	return ob_get_clean();
}
add_shortcode( 'mvw_quickscan', 'mvw_quickscan_shortcode' );
