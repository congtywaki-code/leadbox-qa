<?php
/**
 * Plugin Name: LeadBox QA Runtime Adapter
 * Description: Non-production QA adapter for stable selectors and runtime health checks.
 * Version: 1.1.0
 * Author: LeadBox
 */

if (!defined('ABSPATH')) { exit; }

final class LeadBox_QA_Runtime_Adapter {
    public const VERSION = '1.1.0';

    public static function boot(): void {
        add_action('rest_api_init', [self::class, 'register_routes']);
        add_action('admin_enqueue_scripts', [self::class, 'enqueue_admin_adapter']);
        add_action('wp_enqueue_scripts', [self::class, 'enqueue_public_adapter']);
    }

    private static function enabled(): bool {
        return defined('LEADBOX_QA_MODE') && LEADBOX_QA_MODE === true && wp_get_environment_type() !== 'production';
    }

    public static function register_routes(): void {
        register_rest_route('leadbox-qa/v1', '/health', [
            'methods' => 'GET',
            'permission_callback' => '__return_true',
            'callback' => static function () {
                return new WP_REST_Response([
                    'ok' => self::enabled(),
                    'runtime' => 'wordpress',
                    'environment' => wp_get_environment_type(),
                    'adapterVersion' => self::VERSION,
                    'leadboxQaMode' => self::enabled(),
                ], self::enabled() ? 200 : 503);
            },
        ]);
    }

    public static function enqueue_admin_adapter(string $hook): void {
        if (!self::enabled() || strpos($hook, 'leadbox') === false) { return; }
        wp_enqueue_script('leadbox-qa-selector-adapter', plugin_dir_url(__FILE__) . 'assets/selector-adapter.js', [], self::VERSION, true);
        wp_localize_script('leadbox-qa-selector-adapter', 'LeadBoxQASelectorMap', apply_filters('leadbox_qa_selector_map', self::default_map()));
    }

    public static function enqueue_public_adapter(): void {
        if (!self::enabled()) { return; }
        wp_enqueue_script('leadbox-qa-selector-adapter', plugin_dir_url(__FILE__) . 'assets/selector-adapter.js', [], self::VERSION, true);
        wp_localize_script('leadbox-qa-selector-adapter', 'LeadBoxQASelectorMap', apply_filters('leadbox_qa_selector_map', self::default_map()));
    }

    private static function default_map(): array {
        return [
            ['selector' => '.leadbox-media-library', 'qa' => 'media-library'],
            ['selector' => 'input[type=file][name*=media]', 'qa' => 'media-upload-input'],
            ['selector' => '[name=media_title]', 'qa' => 'media-title'],
            ['selector' => '[name=industry]', 'qa' => 'media-industry'],
            ['selector' => '[name=topic]', 'qa' => 'media-topic'],
            ['selector' => '.leadbox-studio', 'qa' => 'studio-shell'],
            ['selector' => '.leadbox-studio-preview', 'qa' => 'studio-preview'],
        ];
    }
}

LeadBox_QA_Runtime_Adapter::boot();
