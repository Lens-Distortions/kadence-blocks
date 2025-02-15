/**
 * BLOCK: Kadence Restaurant Menu Category
 */

/**
 * External dependencies
 */
import { map } from 'lodash';

/**
 * Internal dependencies
 */
import { PopColorControl, RangeControl, KadencePanelBody, MeasurementControls } from '@kadence/components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
const { Component, Fragment } = wp.element;
const { InspectorControls, ContrastChecker, PanelColorSettings, AlignmentToolbar } = wp.blockEditor;
import {
	ButtonGroup,
	Button,
	TabPanel,
	Dashicon
} from '@wordpress/components';


/**
 * Menu category Settings
 */
class Inspector extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			containerPaddingControl: 'linked',
			containerBorderControl: 'linked',
			containerMarginControl: 'linked',
			mediaBorderControl: 'linked',
			mediaPaddingControl: 'linked',
			mediaMarginControl: 'linked',
		};
	}

	componentDidMount() {

	}

	render() {
		const {
			clientId,
			attributes,
			className,
			isSelected,
			setAttributes,
		} = this.props;

		const {
			hAlign,
			hAlignTablet,
			hAlignMobile,

			cAlign,
			cAlignTablet,
			cAlignMobile,

			containerBackground,
			containerBackgroundOpacity,
			containerHoverBackground,
			containerHoverBackgroundOpacity,
			containerBorder,
			containerBorderOpacity,
			containerHoverBorder,
			containerHoverBorderOpacity,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,
			containerMargin,
			containerMarginUnit,
			maxWidthUnit,
			maxWidth
		} = attributes;

		const { containerBorderControl, mediaBorderControl, mediaPaddingControl, mediaMarginControl, containerPaddingControl, containerMarginControl } = this.state;
		const widthMax = ( maxWidthUnit === 'px' ? 2000 : 100 );
		const widthTypes = [
			{ key: 'px', name: 'px' },
			{ key: '%', name: '%' },
			{ key: 'vw', name: 'vw' },
		];
		const marginTypes = [
			{ key: 'px', name: 'px' },
			{ key: 'em', name: 'em' },
			{ key: '%', name: '%' },
			{ key: 'vh', name: 'vh' },
			{ key: 'rem', name: 'rem' },
		];

		const marginMin = ( containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? -12 : -200 );
		const marginMax = ( containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? 24 : 200 );
		const marginStep = ( containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? 0.1 : 1 );

		return (
			<Fragment>
				<InspectorControls>
					<KadencePanelBody
						title={ __( 'Container Settings' ) }
						initialOpen={ false }
						panelName={ 'kb-restaurant-container' }
					>

						<h2 className="kt-heading-size-title">{ __( 'Menu Title Align' ) }</h2>
						<TabPanel className="kt-size-tabs kb-sidebar-alignment"
							activeClass="active-tab"
							tabs={ [
								{
									name: 'desk',
									title: <Dashicon icon="desktop" />,
									className: 'kt-desk-tab',
								},
								{
									name: 'tablet',
									title: <Dashicon icon="tablet" />,
									className: 'kt-tablet-tab',
								},
								{
									name: 'mobile',
									title: <Dashicon icon="smartphone" />,
									className: 'kt-mobile-tab',
								},
							] }>
							{
								( tab ) => {
									let tabout;
									if ( tab.name ) {
										if ( 'mobile' === tab.name ) {
											tabout = (
												<AlignmentToolbar
													isCollapsed={ false }
													value={ hAlignMobile }
													onChange={ ( value ) => setAttributes( { hAlignMobile: value } ) }
												/>
											);
										} else if ( 'tablet' === tab.name ) {
											tabout = (
												<AlignmentToolbar
													isCollapsed={ false }
													value={ hAlignTablet }
													onChange={ ( value ) => setAttributes( { hAlignTablet: value } ) }
												/>
											);
										} else {
											tabout = (
												<AlignmentToolbar
													isCollapsed={ false }
													value={ hAlign }
													onChange={ ( value ) => setAttributes( { hAlign: value } ) }
												/>
											);
										}
									}
									return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
								}
							}
						</TabPanel>

						<h2 className="kt-heading-size-title">{ __( 'Content Align' ) }</h2>
						<TabPanel className="kt-size-tabs kb-sidebar-alignment"
							activeClass="active-tab"
							tabs={ [
								{
									name: 'desk',
									title: <Dashicon icon="desktop" />,
									className: 'kt-desk-tab',
								},
								{
									name: 'tablet',
									title: <Dashicon icon="tablet" />,
									className: 'kt-tablet-tab',
								},
								{
									name: 'mobile',
									title: <Dashicon icon="smartphone" />,
									className: 'kt-mobile-tab',
								},
							] }>
							{
								( tab ) => {
									let tabout;
									if ( tab.name ) {
										if ( 'mobile' === tab.name ) {
											tabout = (
												<AlignmentToolbar
													isCollapsed={ false }
													value={ cAlignMobile }
													onChange={ ( value ) => setAttributes( { cAlignMobile: value } ) }
												/>
											);
										} else if ( 'tablet' === tab.name ) {
											tabout = (
												<AlignmentToolbar
													isCollapsed={ false }
													value={ cAlignTablet }
													onChange={ ( value ) => setAttributes( { cAlignTablet: value } ) }
												/>
											);
										} else {
											tabout = (
												<AlignmentToolbar
													isCollapsed={ false }
													value={ cAlign }
													onChange={ ( value ) => setAttributes( { cAlign: value } ) }
												/>
											);
										}
									}
									return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
								}
							}
						</TabPanel>

						<MeasurementControls
							label={ __( 'Container Border Width (px)' ) }
							measurement={ containerBorderWidth }
							control={ containerBorderControl }
							onChange={ ( value ) => setAttributes( { containerBorderWidth: value } ) }
							onControl={ ( value ) => this.setState( { containerBorderControl: value } ) }
							min={ 0 }
							max={ 40 }
							step={ 1 }
						/>
						<RangeControl
							label={ __( 'Container Border Radius (px)' ) }
							value={ containerBorderRadius }
							onChange={ value => setAttributes( { containerBorderRadius: value } ) }
							step={ 1 }
							min={ 0 }
							max={ 200 }
						/>
						<TabPanel className="kt-inspect-tabs kt-hover-tabs"
							activeClass="active-tab"
							tabs={ [
								{
									name: 'normal',
									title: __( 'Normal' ),
									className: 'kt-normal-tab',
								},
								{
									name: 'hover',
									title: __( 'Hover' ),
									className: 'kt-hover-tab',
								},
							] }>
							{
								( tab ) => {
									let tabout;
									if ( tab.name ) {
										if ( 'hover' === tab.name ) {
											tabout = (
												<Fragment>
													<PopColorControl
														label={ __( 'Hover Background' ) }
														value={ ( containerHoverBackground ? containerHoverBackground : '#f2f2f2' ) }
														default={ '#f2f2f2' }
														opacityValue={ containerHoverBackgroundOpacity }
														onChange={ value => setAttributes( { containerHoverBackground: value } ) }
														onOpacityChange={ value => setAttributes( { containerHoverBackgroundOpacity: value } ) }
													/>
													<PopColorControl
														label={ __( 'Hover Border' ) }
														value={ ( containerHoverBorder ? containerHoverBorder : '#eeeeee' ) }
														default={ '#eeeeee' }
														opacityValue={ containerHoverBorderOpacity }
														onChange={ value => setAttributes( { containerHoverBorder: value } ) }
														onOpacityChange={ value => setAttributes( { containerHoverBorderOpacity: value } ) }
													/>
												</Fragment>
											);
										} else {
											tabout = (
												<Fragment>
													<PopColorControl
														label={ __( 'Container Background' ) }
														value={ ( containerBackground ? containerBackground : '#f2f2f2' ) }
														default={ '#f2f2f2' }
														opacityValue={ containerBackgroundOpacity }
														onChange={ value => setAttributes( { containerBackground: value } ) }
														onOpacityChange={ value => setAttributes( { containerBackgroundOpacity: value } ) }
													/>
													<PopColorControl
														label={ __( 'Container Border' ) }
														value={ ( containerBorder ? containerBorder : '#eeeeee' ) }
														default={ '#eeeeee' }
														opacityValue={ containerBorderOpacity }
														onChange={ value => setAttributes( { containerBorder: value } ) }
														onOpacityChange={ value => setAttributes( { containerBorderOpacity: value } ) }
													/>
												</Fragment>
											);
										}
									}
									return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
								}
							}
						</TabPanel>
						<MeasurementControls
							label={ __( 'Container Padding' ) }
							measurement={ containerPadding }
							control={ containerPaddingControl }
							onChange={ ( value ) => setAttributes( { containerPadding: value } ) }
							onControl={ ( value ) => this.setState( { containerPaddingControl: value } ) }
							min={ 0 }
							max={ 100 }
							step={ 1 }
						/>
						<ButtonGroup className="kt-size-type-options kt-row-size-type-options kb-typo-when-linked-individual-avail" aria-label={ __( 'Margin Type', 'kadence-blocks' ) }>
							{ map( marginTypes, ( { name, key } ) => (
								<Button
									key={ key }
									className="kt-size-btn"
									isSmall
									isPrimary={ containerMarginUnit === key }
									aria-pressed={ containerMarginUnit === key }
									onClick={ () => setAttributes( { containerMarginUnit: key } ) }
								>
									{ name }
								</Button>
							) ) }
						</ButtonGroup>
						<MeasurementControls
							label={ __( 'Margin', 'kadence-blocks' ) }
							measurement={ containerMargin }
							onChange={ ( value ) => setAttributes( { containerMargin: value } ) }
							control={ containerMarginControl }
							onControl={ ( value ) => this.setState( { containerMarginControl: value } ) }
							min={ marginMin }
							max={ marginMax }
							step={ marginStep }
							allowEmpty={ true }
						/>
						<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Max Width Type' ) }>
							{ map( widthTypes, ( { name, key } ) => (
								<Button
									key={ key }
									className="kt-size-btn"
									isSmall
									isPrimary={ maxWidthUnit === key }
									aria-pressed={ maxWidthUnit === key }
									onClick={ () => setAttributes( { maxWidthUnit: key } ) }
								>
									{ name }
								</Button>
							) ) }
						</ButtonGroup>
						<RangeControl
							label={ __( 'Container Max Width', 'kadence-blocks' ) }
							value={ maxWidth }
							onChange={ ( value ) => {
								setAttributes( {
									maxWidth: value,
								} );
							} }
							min={ 0 }
							max={ widthMax }
						/>
					</KadencePanelBody>
	            </InspectorControls>
	        </Fragment>
		);
	}
}

export default Inspector;
