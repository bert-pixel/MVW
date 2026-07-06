<?php
/**
 * Plugin Name: MVW QuickScan
 * Description: Embeds the Maatschappij van Welstand QuickScan vragenboom on any page via the [mvw_quickscan] shortcode.
 * Version: 1.0.0
 * Author: Bert Hermans
 * License: GPL-2.0-or-later
 * Text Domain: mvw-quickscan
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

define( 'MVW_QUICKSCAN_VERSION', '1.0.0' );
define( 'MVW_QUICKSCAN_HANDLE', 'mvw-quickscan' );

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
 * Attributes (all optional, override the default CTA destinations):
 *   contact_url       - "Neem contact op" destination
 *   voorwaarden_url    - "Bekijk voorwaarden" destination
 *   aanvraag_url        - "Start aanvraag" destination
 */
function mvw_quickscan_shortcode( $atts ) {
	$atts = shortcode_atts(
		array(
			'contact_url'     => '/contact',
			'voorwaarden_url' => '/donatie-aanvragen',
			'aanvraag_url'    => 'https://aanvragen.mvw.nl/Account/Login',
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
							<div class="mvw-outcome-ctas"></div>
						</div>
					</template>

					<div class="mvw-app"></div>
				</div>
			</div>
		</div>
	</div>
	<?php
	return ob_get_clean();
}
add_shortcode( 'mvw_quickscan', 'mvw_quickscan_shortcode' );
