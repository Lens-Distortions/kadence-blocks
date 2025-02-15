/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
const { Component, Fragment } = wp.element;
const { BlockControls }       = wp.blockEditor;
import { Toolbar } from '@wordpress/components';
const { select, dispatch }    = wp.data;
const { createBlock }         = wp.blocks;

/**
 * Build the restaurant menu controls
 */
class Controls extends Component {
	render() {
		const {
			clientId,
			attributes,
			setAttributes,
		} = this.props;

		const {
			fullWidth
		} = attributes

		const toolbarControls = [
			{
				icon: 'plus',
				title: __( 'Add New Menu Item' ),
				isActive: false,
				onClick: () => {
					const innerCount = select("core/editor").getBlocksByClientId(clientId)[0].innerBlocks.length;
					let block = createBlock("kadence/restaurantmenuitem");
					dispatch("core/block-editor").insertBlock(block, innerCount, clientId);
				}
			}
		];

		return (
			<Fragment>
				<BlockControls>
					<Toolbar controls={ toolbarControls } />
				</BlockControls>
			</Fragment>
		);
	}
}

export default Controls;
