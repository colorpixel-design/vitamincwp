<?php
/**
 * Plugin Name: VitaminC — Custom Post Types
 * Description: Registers Serum, Ingredient, and Brand CPTs for the Vitamin C Headless CMS.
 * Version: 1.0.0
 * Author: VitaminC India
 *
 * INSTALLATION:
 *   Upload this file to: wp-content/mu-plugins/vitaminc-cpts.php
 *   It auto-activates — no "Activate Plugin" step needed!
 *
 * mu-plugins = "must-use plugins" — WordPress automatically loads them on every request.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'init', 'vitaminc_register_cpts', 0 );

function vitaminc_register_cpts() {

    // ──────────────────────────────────────────────────────────────────────────
    // 1. SERUM — Vitamin C product listings
    // ──────────────────────────────────────────────────────────────────────────
    register_post_type( 'serum', [
        'labels' => [
            'name'               => 'Serums',
            'singular_name'      => 'Serum',
            'menu_name'          => 'Serums',
            'all_items'          => 'All Serums',
            'add_new'            => 'Add New',
            'add_new_item'       => 'Add New Serum',
            'edit_item'          => 'Edit Serum',
            'new_item'           => 'New Serum',
            'view_item'          => 'View Serum',
            'search_items'       => 'Search Serums',
            'not_found'          => 'No serums found',
            'not_found_in_trash' => 'No serums in trash',
        ],
        'public'              => true,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => true,   // REST API — migration script ke liye
        'rest_base'           => 'serum',
        'has_archive'         => false,
        'hierarchical'        => false,
        'rewrite'             => [ 'slug' => 'serums' ],
        'menu_icon'           => 'dashicons-buddicons-activity',
        'menu_position'       => 5,
        'supports'            => [ 'title', 'thumbnail', 'custom-fields' ],
        'capability_type'     => 'post',
        // WPGraphQL settings
        'show_in_graphql'     => true,
        'graphql_single_name' => 'serum',
        'graphql_plural_name' => 'serums',
    ] );

    // ──────────────────────────────────────────────────────────────────────────
    // 2. INGREDIENT — Ingredient science deep dives
    // ──────────────────────────────────────────────────────────────────────────
    register_post_type( 'ingredient', [
        'labels' => [
            'name'               => 'Ingredients',
            'singular_name'      => 'Ingredient',
            'menu_name'          => 'Ingredients',
            'all_items'          => 'All Ingredients',
            'add_new'            => 'Add New',
            'add_new_item'       => 'Add New Ingredient',
            'edit_item'          => 'Edit Ingredient',
            'new_item'           => 'New Ingredient',
            'view_item'          => 'View Ingredient',
            'search_items'       => 'Search Ingredients',
            'not_found'          => 'No ingredients found',
            'not_found_in_trash' => 'No ingredients in trash',
        ],
        'public'              => true,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => true,
        'rest_base'           => 'ingredient',
        'has_archive'         => false,
        'hierarchical'        => false,
        'rewrite'             => [ 'slug' => 'ingredients' ],
        'menu_icon'           => 'dashicons-test-tube',
        'menu_position'       => 6,
        'supports'            => [ 'title', 'thumbnail', 'custom-fields' ],
        'capability_type'     => 'post',
        // WPGraphQL settings
        'show_in_graphql'     => true,
        'graphql_single_name' => 'ingredient',
        'graphql_plural_name' => 'ingredients',
    ] );

    // ──────────────────────────────────────────────────────────────────────────
    // 3. BRAND — Skincare brand profiles
    // ──────────────────────────────────────────────────────────────────────────
    register_post_type( 'brand', [
        'labels' => [
            'name'               => 'Brands',
            'singular_name'      => 'Brand',
            'menu_name'          => 'Brands',
            'all_items'          => 'All Brands',
            'add_new'            => 'Add New',
            'add_new_item'       => 'Add New Brand',
            'edit_item'          => 'Edit Brand',
            'new_item'           => 'New Brand',
            'view_item'          => 'View Brand',
            'search_items'       => 'Search Brands',
            'not_found'          => 'No brands found',
            'not_found_in_trash' => 'No brands in trash',
        ],
        'public'              => true,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => true,
        'rest_base'           => 'brand',
        'has_archive'         => false,
        'hierarchical'        => false,
        'rewrite'             => [ 'slug' => 'brands' ],
        'menu_icon'           => 'dashicons-tag',
        'menu_position'       => 7,
        'supports'            => [ 'title', 'thumbnail', 'custom-fields' ],
        'capability_type'     => 'post',
        // WPGraphQL settings
        'show_in_graphql'     => true,
        'graphql_single_name' => 'brand',
        'graphql_plural_name' => 'brands',
    ] );

}
