/**
 * Icon Span Tag Component
 *
 */

export default function IconSpanTag( {
		name,
		title,
		strokeWidth = false,
	} ) {
	return (
		<span
			data-name={ name }
			data-stroke={ ( strokeWidth ? strokeWidth : undefined ) }
			data-title={ ( title ? title.replace(/ /g, '_' ) : undefined ) }
			className={ 'kadence-dynamic-icon' }
		></span>
	);
}
