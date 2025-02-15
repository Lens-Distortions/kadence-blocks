/**
 * BLOCK: Kadence Restaurant Menu Cagetory
 */

/**
 * Internal dependencies
 */
import attributes from './attributes';
import edit from './edit';
import save from './save';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const { registerBlockType } = wp.blocks;
const { Fragment }          = wp.element;
import { Icon } from '@wordpress/components';

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/restaurantmenucategory', {
	title: __( 'Menu Category' ),
	category: 'kadence-blocks',
	parent: [ 'kadence/restaurantmenu' ],
	supports: {
		inserter: false
	},
	getEditWrapperProps( attributes ) {
		return {
			style: {
				width: '100%'
			}
		};
	},
	attributes,
	edit,
	save
} );
