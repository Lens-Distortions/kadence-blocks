/**
 * BLOCK: Kadence Advanced Heading
 *
 */
/* global kadence_blocks_params */
/**
 * Internal dependencies
 */
import classnames from 'classnames';
import {
	PopColorControl,
	TextShadowControl,
	TypographyControls,
	InlineTypographyControls,
	ResponsiveMeasurementControls,
	ResponsiveRangeControls,
	RangeControl,
	KadencePanelBody,
	URLInputControl,
	WebfontLoader,
	HeadingLevelIcon,
	InlinePopColorControl,
	ResponsiveAlignControls,
	InspectorControlTabs,
} from '@kadence/components';

import {
	KadenceColorOutput,
	showSettings,
	getPreviewSize,
} from '@kadence/helpers';

/**
 * Block dependencies
 */
import HeadingStyleCopyPaste from './copy-paste-style';
import './markformat';

/**
 * Import Css
 */
import './editor.scss';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import {
	createBlock,
} from '@wordpress/blocks';
import {
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	InspectorAdvancedControls,
	RichText,
	getColorClassName,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Fragment,
	useEffect,
	useState,
} from '@wordpress/element';

import {
	ToolbarGroup,
	Spinner,
	SelectControl,
	TextControl,
} from '@wordpress/components';

import {
	applyFilters,
} from '@wordpress/hooks';

/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;

function KadenceAdvancedHeading( props ) {

	const { attributes, className, setAttributes, mergeBlocks, onReplace, clientId, getPreviewDevice, addUniqueID, isUniqueID, isUniqueBlock, context } = props;
	const {
		inQueryBlock,
		uniqueID,
		align,
		level,
		content,
		color,
		colorClass,
		textShadow,
		mobileAlign,
		tabletAlign,
		size,
		sizeType,
		lineType,
		lineHeight,
		tabLineHeight,
		tabSize,
		mobileSize,
		mobileLineHeight,
		letterSpacing,
		typography,
		fontVariant,
		fontWeight,
		fontStyle,
		fontSubset,
		googleFont,
		loadGoogleFont,
		marginType,
		topMargin,
		bottomMargin,
		markSize,
		markSizeType,
		markLineHeight,
		markLineType,
		markLetterSpacing,
		markTypography,
		markGoogleFont,
		markLoadGoogleFont,
		markFontSubset,
		markFontVariant,
		markFontWeight,
		markFontStyle,
		markPadding,
		markPaddingControl,
		markColor,
		markBG,
		markBGOpacity,
		markBorder,
		markBorderWidth,
		markBorderOpacity,
		markBorderStyle,
		anchor,
		textTransform,
		markTextTransform,
		kadenceAnimation,
		kadenceAOSOptions,
		htmlTag,
		leftMargin,
		rightMargin,
		tabletMargin,
		mobileMargin,
		padding,
		tabletPadding,
		mobilePadding,
		paddingType,
		markMobilePadding,
		markTabPadding,
		loadItalic,
		kadenceDynamic,
		link,
		linkTarget,
		linkNoFollow,
		linkSponsored,
		background,
		backgroundColorClass,
		linkStyle,
		linkColor,
		linkHoverColor,
	} = attributes;

	const [ marginControl, setMarginControl ] = useState( 'individual' );
	const [ paddingControl, setPaddingControl ] = useState( 'individual' );
	const [ markPaddingControls, setMarkPaddingControls ] = useState( 'individual' );
	const [ activeTab, setActiveTab ] = useState( 'general' );

	useEffect( () => {
		let smallID = '_' + clientId.substr( 2, 9 );
		if ( !uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/advancedheading' ] !== undefined && typeof blockConfigObject[ 'kadence/advancedheading' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/advancedheading' ] ).map( ( attribute ) => {
					attributes[ attribute ] = blockConfigObject[ 'kadence/advancedheading' ][ attribute ];
				} );
			}
			setAttributes( {
				uniqueID: smallID,
			} );
			addUniqueID( smallID, clientId );
		} else if ( !isUniqueID( uniqueID ) ) {
			// This checks if we are just switching views, client ID the same means we don't need to update.
			if ( !isUniqueBlock( uniqueID, clientId ) ) {
				attributes.uniqueID = smallID;
				addUniqueID( smallID, clientId );
			}
		} else {
			addUniqueID( uniqueID );
		}
		if ( context && context.queryId && context.postId ) {
			if ( ! inQueryBlock ) {
				setAttributes( {
					inQueryBlock: true,
				} );
			}
		} else if ( inQueryBlock ) {
			setAttributes( {
				inQueryBlock: false,
			} );
		}
	}, [] );

	const saveShadow = ( value ) => {
		const newItems = textShadow.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			textShadow: newItems,
		} );
	};

	const renderTypography = typography && !typography.includes( ',' ) ? '\'' + typography + '\'' : typography;
	const markBGString = ( markBG ? KadenceColorOutput( markBG, markBGOpacity ) : '' );
	const markBorderString = ( markBorder ? KadenceColorOutput( markBorder, markBorderOpacity ) : '' );
	const gconfig = {
		google: {
			families: [ typography + ( fontVariant ? ':' + fontVariant : '' ) ],
		},
	};
	const sgconfig = {
		google: {
			families: [ markTypography + ( markFontVariant ? ':' + markFontVariant : '' ) ],
		},
	};
	const textColorClass = getColorClassName( 'color', colorClass );
	const textBackgroundColorClass = getColorClassName( 'background-color', backgroundColorClass );
	const config = ( googleFont ? gconfig : '' );
	const sconfig = ( markGoogleFont ? sgconfig : '' );
	const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
	const TagHTML = tagName;
	const fontMin = ( sizeType !== 'px' ? 0.2 : 5 );
	const marginMin = ( marginType === 'em' || marginType === 'rem' ? -2 : -200 );
	const marginMax = ( marginType === 'em' || marginType === 'rem' ? 12 : 200 );
	const marginStep = ( marginType === 'em' || marginType === 'rem' ? 0.1 : 1 );
	const paddingMin = ( paddingType === 'em' || paddingType === 'rem' ? 0 : 0 );
	const paddingMax = ( paddingType === 'em' || paddingType === 'rem' ? 12 : 200 );
	const paddingStep = ( paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1 );
	const fontMax = ( sizeType !== 'px' ? 12 : 200 );
	const fontStep = ( sizeType !== 'px' ? 0.1 : 1 );
	const lineMin = ( lineType !== 'px' ? 0.2 : 5 );
	const lineMax = ( lineType !== 'px' ? 12 : 200 );
	const lineStep = ( lineType !== 'px' ? 0.1 : 1 );
	const previewMarginTop = getPreviewSize( getPreviewDevice, ( undefined !== topMargin ? topMargin : '' ), ( undefined !== tabletMargin ? tabletMargin[ 0 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 0 ] : '' ) );
	const previewMarginRight = getPreviewSize( getPreviewDevice, ( undefined !== rightMargin ? rightMargin : '' ), ( undefined !== tabletMargin ? tabletMargin[ 1 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 1 ] : '' ) );
	const previewMarginBottom = getPreviewSize( getPreviewDevice, ( undefined !== bottomMargin ? bottomMargin : '' ), ( undefined !== tabletMargin ? tabletMargin[ 2 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 2 ] : '' ) );
	const previewMarginLeft = getPreviewSize( getPreviewDevice, ( undefined !== leftMargin ? leftMargin : '' ), ( undefined !== tabletMargin ? tabletMargin[ 3 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 3 ] : '' ) );
	const previewPaddingTop = getPreviewSize( getPreviewDevice, ( undefined !== padding ? padding[ 0 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 0 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 0 ] : '' ) );
	const previewPaddingRight = getPreviewSize( getPreviewDevice, ( undefined !== padding ? padding[ 1 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 1 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 1 ] : '' ) );
	const previewPaddingBottom = getPreviewSize( getPreviewDevice, ( undefined !== padding ? padding[ 2 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 2 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 2 ] : '' ) );
	const previewPaddingLeft = getPreviewSize( getPreviewDevice, ( undefined !== padding ? padding[ 3 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 3 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 3 ] : '' ) );
	const previewFontSize = getPreviewSize( getPreviewDevice, ( undefined !== size ? size : '' ), ( undefined !== tabSize ? tabSize : '' ), ( undefined !== mobileSize ? mobileSize : '' ) );
	const previewLineHeight = getPreviewSize( getPreviewDevice, ( undefined !== lineHeight ? lineHeight : '' ), ( undefined !== tabLineHeight ? tabLineHeight : '' ), ( undefined !== mobileLineHeight ? mobileLineHeight : '' ) );
	const previewAlign = getPreviewSize( getPreviewDevice, ( undefined !== align ? align : '' ), ( undefined !== tabletAlign ? tabletAlign : '' ), ( undefined !== mobileAlign ? mobileAlign : '' ) );
	const previewMarkPaddingTop = getPreviewSize( getPreviewDevice, ( undefined !== markPadding ? markPadding[ 0 ] : 0 ), ( undefined !== markTabPadding ? markTabPadding[ 0 ] : '' ), ( undefined !== markMobilePadding ? markMobilePadding[ 0 ] : '' ) );
	const previewMarkPaddingRight = getPreviewSize( getPreviewDevice, ( undefined !== markPadding ? markPadding[ 1 ] : 0 ), ( undefined !== markTabPadding ? markTabPadding[ 1 ] : '' ), ( undefined !== markMobilePadding ? markMobilePadding[ 1 ] : '' ) );
	const previewMarkPaddingBottom = getPreviewSize( getPreviewDevice, ( undefined !== markPadding ? markPadding[ 2 ] : 0 ), ( undefined !== markTabPadding ? markTabPadding[ 2 ] : '' ), ( undefined !== markMobilePadding ? markMobilePadding[ 2 ] : '' ) );
	const previewMarkPaddingLeft = getPreviewSize( getPreviewDevice, ( undefined !== markPadding ? markPadding[ 3 ] : 0 ), ( undefined !== markTabPadding ? markTabPadding[ 3 ] : '' ), ( undefined !== markMobilePadding ? markMobilePadding[ 3 ] : '' ) );
	const previewMarkSize = getPreviewSize( getPreviewDevice, ( undefined !== markSize ? markSize[ 0 ] : '' ), ( undefined !== markSize ? markSize[ 1 ] : '' ), ( undefined !== markSize ? markSize[ 2 ] : '' ) );
	const previewMarkLineHeight = getPreviewSize( getPreviewDevice, ( undefined !== markLineHeight ? markLineHeight[ 0 ] : '' ), ( undefined !== markLineHeight ? markLineHeight[ 1 ] : '' ), ( undefined !== markLineHeight ? markLineHeight[ 2 ] : '' ) );
	const headingOptions = [
		[
			{
				icon    : <HeadingLevelIcon level={1} isPressed={( 1 === level && htmlTag && htmlTag === 'heading' ? true : false )}/>,
				title   : __( 'Heading 1', 'kadence-blocks' ),
				isActive: ( 1 === level && htmlTag && htmlTag === 'heading' ? true : false ),
				onClick : () => setAttributes( { level: 1, htmlTag: 'heading' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={2} isPressed={( 2 === level && htmlTag && htmlTag === 'heading' ? true : false )}/>,
				title   : __( 'Heading 2', 'kadence-blocks' ),
				isActive: ( 2 === level && htmlTag && htmlTag === 'heading' ? true : false ),
				onClick : () => setAttributes( { level: 2, htmlTag: 'heading' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={3} isPressed={( 3 === level && htmlTag && htmlTag === 'heading' ? true : false )}/>,
				title   : __( 'Heading 3', 'kadence-blocks' ),
				isActive: ( 3 === level && htmlTag && htmlTag === 'heading' ? true : false ),
				onClick : () => setAttributes( { level: 3, htmlTag: 'heading' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={4} isPressed={( 4 === level && htmlTag && htmlTag === 'heading' ? true : false )}/>,
				title   : __( 'Heading 4', 'kadence-blocks' ),
				isActive: ( 4 === level && htmlTag && htmlTag === 'heading' ? true : false ),
				onClick : () => setAttributes( { level: 4, htmlTag: 'heading' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={5} isPressed={( 5 === level && htmlTag && htmlTag === 'heading' ? true : false )}/>,
				title   : __( 'Heading 5', 'kadence-blocks' ),
				isActive: ( 5 === level && htmlTag && htmlTag === 'heading' ? true : false ),
				onClick : () => setAttributes( { level: 5, htmlTag: 'heading' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={6} isPressed={( 6 === level && htmlTag && htmlTag === 'heading' ? true : false )}/>,
				title   : __( 'Heading 6', 'kadence-blocks' ),
				isActive: ( 6 === level && htmlTag && htmlTag === 'heading' ? true : false ),
				onClick : () => setAttributes( { level: 6, htmlTag: 'heading' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={'p'} isPressed={( htmlTag && htmlTag === 'p' ? true : false )}/>,
				title   : __( 'Paragraph', 'kadence-blocks' ),
				isActive: ( htmlTag && htmlTag === 'p' ? true : false ),
				onClick : () => setAttributes( { htmlTag: 'p' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={'span'} isPressed={( htmlTag && htmlTag === 'span' ? true : false )}/>,
				title   : __( 'Span', 'kadence-blocks' ),
				isActive: ( htmlTag && htmlTag === 'span' ? true : false ),
				onClick : () => setAttributes( { htmlTag: 'span' } ),
			},
		],
		[
			{
				icon    : <HeadingLevelIcon level={'div'} isPressed={( htmlTag && htmlTag === 'div' ? true : false )}/>,
				title   : __( 'div', 'kadence-blocks' ),
				isActive: ( htmlTag && htmlTag === 'div' ? true : false ),
				onClick : () => setAttributes( { htmlTag: 'div' } ),
			},
		],
	];

	const classes = classnames( {
		[ `kt-adv-heading${uniqueID}` ]: uniqueID,
		[ className ]                  : className,
		'kb-content-is-dynamic'        : undefined !== kadenceDynamic && undefined !== kadenceDynamic[ 'content' ] && undefined !== kadenceDynamic[ 'content' ].enable && kadenceDynamic[ 'content' ].enable,
		[ textColorClass ]             : textColorClass,
		'has-text-color'               : textColorClass,
		[ textBackgroundColorClass ]   : textBackgroundColorClass,
		'has-background'               : textBackgroundColorClass,
		[ `hls-${linkStyle}` ]         : !link && linkStyle,
	} );

	const dynamicHeadingContent = (
		<TagHTML
			style={{
				textAlign      : previewAlign,
				color          : color ? KadenceColorOutput( color ) : undefined,
				backgroundColor: background ? KadenceColorOutput( background ) : undefined,
				fontWeight     : fontWeight,
				fontStyle      : fontStyle,
				fontSize       : ( previewFontSize ? previewFontSize + sizeType : undefined ),
				lineHeight     : ( previewLineHeight ? previewLineHeight + lineType : undefined ),
				letterSpacing  : ( undefined !== letterSpacing && '' !== letterSpacing ? letterSpacing + 'px' : undefined ),
				textTransform  : ( textTransform ? textTransform : undefined ),
				fontFamily     : ( typography ? renderTypography : '' ),
				paddingTop     : ( '' !== previewPaddingTop ? previewPaddingTop + paddingType : undefined ),
				paddingRight   : ( '' !== previewPaddingRight ? previewPaddingRight + paddingType : undefined ),
				paddingBottom  : ( '' !== previewPaddingBottom ? previewPaddingBottom + paddingType : undefined ),
				paddingLeft    : ( '' !== previewPaddingLeft ? previewPaddingLeft + paddingType : undefined ),
				marginTop      : ( '' !== previewMarginTop ? previewMarginTop + marginType : undefined ),
				marginRight    : ( '' !== previewMarginRight ? previewMarginRight + marginType : undefined ),
				marginBottom   : ( '' !== previewMarginBottom ? previewMarginBottom + marginType : undefined ),
				marginLeft     : ( '' !== previewMarginLeft ? previewMarginLeft + marginType : undefined ),
				textShadow     : ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].enable && textShadow[ 0 ].enable ? ( undefined !== textShadow[ 0 ].hOffset ? textShadow[ 0 ].hOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].vOffset ? textShadow[ 0 ].vOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].blur ? textShadow[ 0 ].blur : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].color ? KadenceColorOutput( textShadow[ 0 ].color ) : 'rgba(0,0,0,0.2)' ) : undefined ),
			}}
			className={classes}
		>
			{applyFilters( 'kadence.dynamicContent', <Spinner/>, attributes, 'content' )}
		</TagHTML>
	);
	const headingContent = (
		<RichText
			tagName={tagName}
			allowedFormats={( link ? applyFilters( 'kadence.whitelist_richtext_formats', [ 'core/bold', 'core/italic', 'kadence/insert-dynamic', 'kadence/mark', 'core/strikethrough', 'core/superscript', 'core/superscript', 'toolset/inline-field' ], 'kadence/advancedheading' ) : undefined )}
			value={content}
			onChange={( value ) => setAttributes( { content: value } )}
			onMerge={mergeBlocks}
			onSplit={( value ) => {
				if ( !value ) {
					return createBlock( 'core/paragraph' );
				}
				return createBlock( 'kadence/advancedheading', {
					...attributes,
					content: value,
				} );
			}}
			onReplace={onReplace}
			onRemove={() => onReplace( [] )}
			style={{
				textAlign      : previewAlign,
				color          : color ? KadenceColorOutput( color ) : undefined,
				backgroundColor: background ? KadenceColorOutput( background ) : undefined,
				fontWeight     : fontWeight,
				fontStyle      : fontStyle,
				fontSize       : ( previewFontSize ? previewFontSize + sizeType : undefined ),
				lineHeight     : ( previewLineHeight ? previewLineHeight + lineType : undefined ),
				letterSpacing  : ( undefined !== letterSpacing && '' !== letterSpacing ? letterSpacing + 'px' : undefined ),
				textTransform  : ( textTransform ? textTransform : undefined ),
				fontFamily     : ( typography ? renderTypography : '' ),
				paddingTop     : ( '' !== previewPaddingTop ? previewPaddingTop + paddingType : undefined ),
				paddingRight   : ( '' !== previewPaddingRight ? previewPaddingRight + paddingType : undefined ),
				paddingBottom  : ( '' !== previewPaddingBottom ? previewPaddingBottom + paddingType : undefined ),
				paddingLeft    : ( '' !== previewPaddingLeft ? previewPaddingLeft + paddingType : undefined ),
				marginTop      : ( '' !== previewMarginTop ? previewMarginTop + marginType : undefined ),
				marginRight    : ( '' !== previewMarginRight ? previewMarginRight + marginType : undefined ),
				marginBottom   : ( '' !== previewMarginBottom ? previewMarginBottom + marginType : undefined ),
				marginLeft     : ( '' !== previewMarginLeft ? previewMarginLeft + marginType : undefined ),
				textShadow     : ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].enable && textShadow[ 0 ].enable ? ( undefined !== textShadow[ 0 ].hOffset ? textShadow[ 0 ].hOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].vOffset ? textShadow[ 0 ].vOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].blur ? textShadow[ 0 ].blur : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].color ? KadenceColorOutput( textShadow[ 0 ].color ) : 'rgba(0,0,0,0.2)' ) : undefined ),
			}}
			className={classes}
			placeholder={__( 'Write something…', 'kadence-blocks' )}
		/>
	);
	const headingLinkContent = (
		<a
			href={link}
			className={`kb-advanced-heading-link${( linkStyle ? ' hls-' + linkStyle : '' )}`}
			onClick={( event ) => {
				event.preventDefault();
			}}
		>
			{undefined !== kadenceDynamic && undefined !== kadenceDynamic[ 'content' ] && undefined !== kadenceDynamic[ 'content' ].enable && kadenceDynamic[ 'content' ].enable ? dynamicHeadingContent : headingContent}
		</a>
	);

	const blockProps = useBlockProps( {} );

	return (
		<div {...blockProps}>
			<style>
				{`.kt-adv-heading${uniqueID} mark, .kt-adv-heading${uniqueID}.rich-text:focus mark[data-rich-text-format-boundary] {
						color: ${KadenceColorOutput( markColor )};
						background: ${( markBG ? markBGString : 'transparent' )};
						font-weight: ${( markFontWeight ? markFontWeight : 'inherit' )};
						font-style: ${( markFontStyle ? markFontStyle : 'inherit' )};
						font-size: ${( previewMarkSize ? previewMarkSize + markSizeType : 'inherit' )};
						line-height: ${( previewMarkLineHeight ? previewMarkLineHeight + markLineType : 'inherit' )};
						letter-spacing: ${( markLetterSpacing ? markLetterSpacing + 'px' : 'inherit' )};
						text-transform: ${( markTextTransform ? markTextTransform : 'inherit' )};
						font-family: ${( markTypography ? markTypography : 'inherit' )};
						border-color: ${( markBorder ? markBorderString : 'transparent' )};
						border-width: ${( markBorderWidth ? markBorderWidth + 'px' : '0' )};
						border-style: ${( markBorderStyle ? markBorderStyle : 'solid' )};
						padding-top: ${( previewMarkPaddingTop ? previewMarkPaddingTop + 'px ' : '0' )};
						padding-right: ${( previewMarkPaddingRight ? previewMarkPaddingRight + 'px ' : '0' )};
						padding-bottom: ${( previewMarkPaddingBottom ? previewMarkPaddingBottom + 'px ' : '0' )};
						padding-left: ${( previewMarkPaddingLeft ? previewMarkPaddingLeft + 'px ' : '0' )};
					}`}
				{linkColor && (
					`.kt-adv-heading${uniqueID} a, #block-${clientId} a.kb-advanced-heading-link, #block-${clientId} a.kb-advanced-heading-link > .wp-block-kadence-advancedheading {
							color: ${KadenceColorOutput( linkColor )} !important;
						}`
				)}
				{linkHoverColor && (
					`.kt-adv-heading${uniqueID} a:hover, #block-${clientId} a.kb-advanced-heading-link:hover, #block-${clientId} a.kb-advanced-heading-link:hover > .wp-block-kadence-advancedheading {
							color: ${KadenceColorOutput( linkHoverColor )}!important;
						}`
				)}
			</style>
			<BlockControls>
				<ToolbarGroup
					isCollapsed={true}
					icon={<HeadingLevelIcon level={( htmlTag !== 'heading' ? htmlTag : level )}/>}
					label={__( 'Change heading tag', 'kadence-blocks' )}
					controls={headingOptions}
				/>
				{showSettings( 'allSettings', 'kadence/advancedheading' ) && showSettings( 'toolbarTypography', 'kadence/advancedheading' ) && (
					<InlineTypographyControls
						uniqueID={uniqueID}
						fontGroup={'heading'}
						letterSpacing={letterSpacing}
						onLetterSpacing={( value ) => setAttributes( { letterSpacing: value } )}
						fontFamily={typography}
						onFontFamily={( value ) => setAttributes( { typography: value } )}
						onFontChange={( select ) => {
							setAttributes( {
								typography: select.value,
								googleFont: select.google,
							} );
						}}
						googleFont={googleFont}
						onGoogleFont={( value ) => setAttributes( { googleFont: value } )}
						loadGoogleFont={loadGoogleFont}
						onLoadGoogleFont={( value ) => setAttributes( { loadGoogleFont: value } )}
						fontVariant={fontVariant}
						onFontVariant={( value ) => setAttributes( { fontVariant: value } )}
						fontWeight={fontWeight}
						onFontWeight={( value ) => setAttributes( { fontWeight: value } )}
						fontStyle={fontStyle}
						onFontStyle={( value ) => setAttributes( { fontStyle: value } )}
						fontSubset={fontSubset}
						onFontSubset={( value ) => setAttributes( { fontSubset: value } )}
						textTransform={textTransform}
						onTextTransform={( value ) => setAttributes( { textTransform: value } )}
						fontSizeArray={false}
						fontSize={size}
						onFontSize={( value ) => setAttributes( { size: value } )}
						fontSizeType={sizeType}
						onFontSizeType={( value ) => setAttributes( { sizeType: value } )}
						lineHeight={lineHeight}
						onLineHeight={( value ) => setAttributes( { lineHeight: value } )}
						lineHeightType={lineType}
						onLineHeightType={( value ) => setAttributes( { lineType: value } )}
						tabSize={tabSize}
						onTabSize={( value ) => setAttributes( { tabSize: value } )}
						tabLineHeight={tabLineHeight}
						onTabLineHeight={( value ) => setAttributes( { tabLineHeight: value } )}
						mobileSize={mobileSize}
						onMobileSize={( value ) => setAttributes( { mobileSize: value } )}
						mobileLineHeight={mobileLineHeight}
						onMobileLineHeight={( value ) => setAttributes( { mobileLineHeight: value } )}
					/>
				)}
				{showSettings( 'allSettings', 'kadence/advancedheading' ) && showSettings( 'toolbarColor', 'kadence/advancedheading' ) && (
					<InlinePopColorControl
						label={__( 'Color', 'kadence-blocks' )}
						value={( color ? color : '' )}
						default={''}
						onChange={( value ) => setAttributes( { color: value } )}
						onClassChange={value => setAttributes( { colorClass: value } )}
					/>
				)}
				<AlignmentToolbar
					value={align}
					onChange={( nextAlign ) => {
						setAttributes( { align: nextAlign } );
					}}
				/>
				<HeadingStyleCopyPaste
					onPaste={value => setAttributes( value )}
					blockAttributes={attributes}
				/>
			</BlockControls>
			{showSettings( 'allSettings', 'kadence/advancedheading' ) && (
				<InspectorControls>

					<InspectorControlTabs
						panelName={'advanced-heading'}
						setActiveTab={( value ) => setActiveTab( value )}
						activeTab={activeTab}
					/>

					{( activeTab === 'general' ) &&
						<>
							<KadencePanelBody
								title={__( 'Settings', 'kadence-blocks' )}
								panelName={'kb-adv-heading-settings'}
							>
								<div className="kb-tag-level-control components-base-control">
									<p className="kb-component-label">{__( 'HTML Tag', 'kadence-blocks' )}</p>
									<ToolbarGroup
										isCollapsed={false}
										label={__( 'Change HTML Tag', 'kadence-blocks' )}
										controls={headingOptions}
									/>
								</div>
								<ResponsiveAlignControls
									label={__( 'Text Alignment', 'kadence-blocks' )}
									value={( align ? align : '' )}
									mobileValue={( mobileAlign ? mobileAlign : '' )}
									tabletValue={( tabletAlign ? tabletAlign : '' )}
									onChange={( nextAlign ) => setAttributes( { align: nextAlign } )}
									onChangeTablet={( nextAlign ) => setAttributes( { tabletAlign: nextAlign } )}
									onChangeMobile={( nextAlign ) => setAttributes( { mobileAlign: nextAlign } )}
								/>
								{showSettings( 'colorSettings', 'kadence/advancedheading' ) && (
									<Fragment>
										<PopColorControl
											label={__( 'Color', 'kadence-blocks' )}
											value={( color ? color : '' )}
											default={''}
											onChange={value => setAttributes( { color: value } )}
											onClassChange={value => setAttributes( { colorClass: value } )}
										/>
										<PopColorControl
											label={__( 'Background Color', 'kadence-blocks' )}
											value={( background ? background : '' )}
											default={''}
											onChange={value => setAttributes( { background: value } )}
											onClassChange={value => setAttributes( { backgroundColorClass: value } )}
										/>
									</Fragment>
								)}
								{showSettings( 'sizeSettings', 'kadence/advancedheading' ) && (
									<Fragment>
										<ResponsiveRangeControls
											label={__( 'Font Size', 'kadence-blocks' )}
											value={( size ? size : '' )}
											onChange={value => setAttributes( { size: value } )}
											tabletValue={( tabSize ? tabSize : '' )}
											onChangeTablet={( value ) => setAttributes( { tabSize: value } )}
											mobileValue={( mobileSize ? mobileSize : '' )}
											onChangeMobile={( value ) => setAttributes( { mobileSize: value } )}
											min={fontMin}
											max={fontMax}
											step={fontStep}
											unit={sizeType}
											onUnit={( value ) => setAttributes( { sizeType: value } )}
											units={[ 'px', 'em', 'rem', 'vw' ]}
										/>
										<ResponsiveRangeControls
											label={__( 'Line Height', 'kadence-blocks' )}
											value={( lineHeight ? lineHeight : '' )}
											onChange={value => setAttributes( { lineHeight: value } )}
											tabletValue={( tabLineHeight ? tabLineHeight : '' )}
											onChangeTablet={( value ) => setAttributes( { tabLineHeight: value } )}
											mobileValue={( mobileLineHeight ? mobileLineHeight : '' )}
											onChangeMobile={( value ) => setAttributes( { mobileLineHeight: value } )}
											min={lineMin}
											max={lineMax}
											step={lineStep}
											unit={lineType}
											onUnit={( value ) => setAttributes( { lineType: value } )}
											units={[ 'px', 'em', 'rem' ]}
										/>
									</Fragment>
								)}
							</KadencePanelBody>
							{showSettings( 'advancedSettings', 'kadence/advancedheading' ) && (
								<KadencePanelBody
									title={__( 'Advanced Typography Settings', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-adv-heading-typography-settings'}
								>
									<TypographyControls
										fontGroup={'heading'}
										letterSpacing={letterSpacing}
										onLetterSpacing={( value ) => setAttributes( { letterSpacing: value } )}
										fontFamily={typography}
										onFontFamily={( value ) => setAttributes( { typography: value } )}
										onFontChange={( select ) => {
											setAttributes( {
												typography: select.value,
												googleFont: select.google,
											} );
										}}
										googleFont={googleFont}
										onGoogleFont={( value ) => setAttributes( { googleFont: value } )}
										loadGoogleFont={loadGoogleFont}
										onLoadGoogleFont={( value ) => setAttributes( { loadGoogleFont: value } )}
										fontVariant={fontVariant}
										onFontVariant={( value ) => setAttributes( { fontVariant: value } )}
										fontWeight={fontWeight}
										onFontWeight={( value ) => setAttributes( { fontWeight: value } )}
										fontStyle={fontStyle}
										onFontStyle={( value ) => setAttributes( { fontStyle: value } )}
										fontSubset={fontSubset}
										onFontSubset={( value ) => setAttributes( { fontSubset: value } )}
										textTransform={textTransform}
										onTextTransform={( value ) => setAttributes( { textTransform: value } )}
										loadItalic={loadItalic}
										onLoadItalic={( value ) => setAttributes( { loadItalic: value } )}
									/>
								</KadencePanelBody>
							)}
							{showSettings( 'highlightSettings', 'kadence/advancedheading' ) && (
								<KadencePanelBody
									title={__( 'Highlight Settings', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-adv-heading-highlight-settings'}
								>
									<PopColorControl
										label={__( 'Highlight Color', 'kadence-blocks' )}
										value={( markColor ? markColor : '' )}
										default={''}
										onChange={value => setAttributes( { markColor: value } )}
									/>
									<PopColorControl
										label={__( 'Highlight Background', 'kadence-blocks' )}
										value={( markBG ? markBG : '' )}
										default={''}
										onChange={value => setAttributes( { markBG: value } )}
										opacityValue={markBGOpacity}
										onOpacityChange={value => setAttributes( { markBGOpacity: value } )}
										onArrayChange={( color, opacity ) => setAttributes( { markBG: color, markBGOpacity: opacity } )}
									/>
									<PopColorControl
										label={__( 'Highlight Border Color', 'kadence-blocks' )}
										value={( markBorder ? markBorder : '' )}
										default={''}
										onChange={value => setAttributes( { markBorder: value } )}
										opacityValue={markBorderOpacity}
										onOpacityChange={value => setAttributes( { markBorderOpacity: value } )}
										onArrayChange={( color, opacity ) => setAttributes( { markBorder: color, markBorderOpacity: opacity } )}
									/>
									<SelectControl
										label={__( 'Highlight Border Style', 'kadence-blocks' )}
										value={markBorderStyle}
										options={[
											{ value: 'solid', label: __( 'Solid', 'kadence-blocks' ) },
											{ value: 'dashed', label: __( 'Dashed', 'kadence-blocks' ) },
											{ value: 'dotted', label: __( 'Dotted', 'kadence-blocks' ) },
										]}
										onChange={value => setAttributes( { markBorderStyle: value } )}
									/>
									<RangeControl
										label={__( 'Highlight Border Width', 'kadence-blocks' )}
										value={markBorderWidth}
										onChange={value => setAttributes( { markBorderWidth: value } )}
										min={0}
										max={20}
										step={1}
									/>
									<TypographyControls
										fontGroup={'heading'}
										fontSize={markSize}
										onFontSize={( value ) => setAttributes( { markSize: value } )}
										fontSizeType={markSizeType}
										onFontSizeType={( value ) => setAttributes( { markSizeType: value } )}
										lineHeight={markLineHeight}
										onLineHeight={( value ) => setAttributes( { markLineHeight: value } )}
										lineHeightType={markLineType}
										onLineHeightType={( value ) => setAttributes( { markLineType: value } )}
										letterSpacing={markLetterSpacing}
										onLetterSpacing={( value ) => setAttributes( { markLetterSpacing: value } )}
										fontFamily={markTypography}
										onFontFamily={( value ) => setAttributes( { markTypography: value } )}
										onFontChange={( select ) => {
											setAttributes( {
												markTypography: select.value,
												markGoogleFont: select.google,
											} );
										}}
										googleFont={markGoogleFont}
										onGoogleFont={( value ) => setAttributes( { markGoogleFont: value } )}
										loadGoogleFont={markLoadGoogleFont}
										onLoadGoogleFont={( value ) => setAttributes( { markLoadGoogleFont: value } )}
										fontVariant={markFontVariant}
										onFontVariant={( value ) => setAttributes( { markFontVariant: value } )}
										fontWeight={markFontWeight}
										onFontWeight={( value ) => setAttributes( { markFontWeight: value } )}
										fontStyle={markFontStyle}
										onFontStyle={( value ) => setAttributes( { markFontStyle: value } )}
										fontSubset={markFontSubset}
										onFontSubset={( value ) => setAttributes( { markFontSubset: value } )}
										textTransform={markTextTransform}
										onTextTransform={( value ) => setAttributes( { markTextTransform: value } )}
									/>
									<ResponsiveMeasurementControls
										label={__( 'Padding', 'kadence-blocks' )}
										value={markPadding}
										control={markPaddingControls}
										tabletValue={markTabPadding}
										mobileValue={markMobilePadding}
										onChange={( value ) => setAttributes( { markPadding: value } )}
										onChangeTablet={( value ) => setAttributes( { markTabPadding: value } )}
										onChangeMobile={( value ) => setAttributes( { markMobilePadding: value } )}
										onChangeControl={( value ) => setMarkPaddingControls( value )}
										min={0}
										max={100}
										step={1}
										unit={'px'}
										units={[ 'px' ]}
										showUnit={true}
									/>
								</KadencePanelBody>
							)}
							{showSettings( 'linkSettings', 'kadence/advancedheading' ) && (
								<KadencePanelBody
									title={__( 'Link Settings', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-adv-heading-link-settings'}
								>
									<PopColorControl
										label={__( 'Link Color', 'kadence-blocks' )}
										swatchLabel={__( 'Link Color', 'kadence-blocks' )}
										value={( linkColor ? linkColor : '' )}
										default={''}
										onChange={value => setAttributes( { linkColor: value } )}
										swatchLabel2={__( 'Hover Color', 'kadence-blocks' )}
										value2={( linkHoverColor ? linkHoverColor : '' )}
										default2={''}
										onChange2={value => setAttributes( { linkHoverColor: value } )}
									/>
									<SelectControl
										label={__( 'Link Style', 'kadence-blocks' )}
										value={linkStyle}
										options={[
											{ value: '', label: __( 'Unset', 'kadence-blocks' ) },
											{ value: 'none', label: __( 'None', 'kadence-blocks' ) },
											{ value: 'underline', label: __( 'Underline', 'kadence-blocks' ) },
											{ value: 'hover_underline', label: __( 'Underline on Hover', 'kadence-blocks' ) },
										]}
										onChange={value => setAttributes( { linkStyle: value } )}
									/>
									<URLInputControl
										label={__( 'Heading Wrap Link', 'kadence-blocks' )}
										url={link}
										onChangeUrl={value => setAttributes( { link: value } )}
										additionalControls={true}
										opensInNewTab={( undefined !== linkTarget ? linkTarget : false )}
										onChangeTarget={value => setAttributes( { linkTarget: value } )}
										linkNoFollow={( undefined !== linkNoFollow ? linkNoFollow : false )}
										onChangeFollow={value => setAttributes( { linkNoFollow: value } )}
										linkSponsored={( undefined !== linkSponsored ? linkSponsored : false )}
										onChangeSponsored={value => setAttributes( { linkSponsored: value } )}
										dynamicAttribute={'link'}
										allowClear={true}
										{...props}
									/>
								</KadencePanelBody>
							)}
						</>
					}

					{( activeTab === 'style' ) &&
						<>
							{showSettings( 'marginSettings', 'kadence/advancedheading' ) && (
								<KadencePanelBody
									title={__( 'Spacing Settings', 'kadence-blocks' )}
									panelName={'kb-adv-heading-spacing-settings'}
								>
									<ResponsiveMeasurementControls
										label={__( 'Padding', 'kadence-blocks' )}
										value={padding}
										control={paddingControl}
										tabletValue={tabletPadding}
										mobileValue={mobilePadding}
										onChange={( value ) => setAttributes( { padding: value } )}
										onChangeTablet={( value ) => setAttributes( { tabletPadding: value } )}
										onChangeMobile={( value ) => setAttributes( { mobilePadding: value } )}
										onChangeControl={( value ) => setPaddingControl( value )}
										min={paddingMin}
										max={paddingMax}
										step={paddingStep}
										unit={paddingType}
										units={[ 'px', 'em', 'rem', '%' ]}
										onUnit={( value ) => setAttributes( { paddingType: value } )}
									/>
									<ResponsiveMeasurementControls
										label={__( 'Margin', 'kadence-blocks' )}
										value={[ ( undefined !== topMargin ? topMargin : '' ), ( undefined !== rightMargin ? rightMargin : '' ), ( undefined !== bottomMargin ? bottomMargin : '' ), ( undefined !== leftMargin ? leftMargin : '' ) ]}
										control={marginControl}
										tabletValue={tabletMargin}
										mobileValue={mobileMargin}
										onChange={( value ) => {
											setAttributes( { topMargin: value[ 0 ], rightMargin: value[ 1 ], bottomMargin: value[ 2 ], leftMargin: value[ 3 ] } );
										}}
										onChangeTablet={( value ) => setAttributes( { tabletMargin: value } )}
										onChangeMobile={( value ) => setAttributes( { mobileMargin: value } )}
										onChangeControl={( value ) => setMarginControl( value )}
										min={marginMin}
										max={marginMax}
										step={marginStep}
										unit={marginType}
										units={[ 'px', 'em', 'rem', '%', 'vh' ]}
										onUnit={( value ) => setAttributes( { marginType: value } )}
									/>
								</KadencePanelBody>
							)}
							<KadencePanelBody
								title={__( 'Text Shadow Settings', 'kadence-blocks' )}
								initialOpen={false}
								panelName={'kb-adv-heading-text-shadow'}
							>
								<TextShadowControl
									label={__( 'Text Shadow', 'kadence-blocks' )}
									enable={( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].enable ? textShadow[ 0 ].enable : false )}
									color={( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].color ? textShadow[ 0 ].color : 'rgba(0, 0, 0, 0.2)' )}
									colorDefault={'rgba(0, 0, 0, 0.2)'}
									hOffset={( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].hOffset ? textShadow[ 0 ].hOffset : 1 )}
									vOffset={( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].vOffset ? textShadow[ 0 ].vOffset : 1 )}
									blur={( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].blur ? textShadow[ 0 ].blur : 1 )}
									onEnableChange={value => {
										saveShadow( { enable: value } );
									}}
									onColorChange={value => {
										saveShadow( { color: value } );
									}}
									onHOffsetChange={value => {
										saveShadow( { hOffset: value } );
									}}
									onVOffsetChange={value => {
										saveShadow( { vOffset: value } );
									}}
									onBlurChange={value => {
										saveShadow( { blur: value } );
									}}
								/>
							</KadencePanelBody>
						</>
					}
				</InspectorControls>
			)}
			<InspectorAdvancedControls>
				<TextControl
					label={__( 'HTML Anchor', 'kadence-blocks' )}
					help={__( 'Anchors lets you link directly to a section on a page.', 'kadence-blocks' )}
					value={anchor || ''}
					onChange={( nextValue ) => {
						nextValue = nextValue.replace( ANCHOR_REGEX, '-' );
						setAttributes( {
							anchor: nextValue,
						} );
					}}/>
			</InspectorAdvancedControls>
			{kadenceAnimation && (
				<div className={`kt-animation-wrap-${kadenceAnimation}`}>
					<div id={`animate-id${uniqueID}`} className={'aos-animate kt-animation-wrap'} data-aos={( kadenceAnimation ? kadenceAnimation : undefined )}
						 data-aos-duration={( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined )}
						 data-aos-easing={( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined )}
					>
						{link ? headingLinkContent : headingContent}
					</div>
				</div>
			)}
			{!kadenceAnimation && (
				link ? headingLinkContent : headingContent
			)}
			{googleFont && (
				<WebfontLoader config={config}>
				</WebfontLoader>
			)}
			{markGoogleFont && (
				<WebfontLoader config={sconfig}>
				</WebfontLoader>
			)}
		</div>
	);

}

export default compose( [
	withSelect( ( select ) => {
		return {
			getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			isUniqueID      : ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
			isUniqueBlock   : ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		addUniqueID: ( value, clientId ) => dispatch( 'kadenceblocks/data' ).addUniqueID( value, clientId ),
	} ) ),
] )( KadenceAdvancedHeading );
