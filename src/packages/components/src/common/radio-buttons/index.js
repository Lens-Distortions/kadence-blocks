/**
 * Radio Buttons control.
 *
 */
/**
 * Import Css
 */
 import './editor.scss';

import {
	Button,
	ButtonGroup,
} from '@wordpress/components';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function KadenceRadioButtons( {
		label,
		value,
		onChange,
		options = [],
		className,
		...props
	} ) {
	return (
		<div className={ `kadence-radio-buttons-wrap${ className ? ' ' + className : '' }` }>
			{ label && (
				<h2>{ label }</h2>
			) }
			<ButtonGroup className="kadence-radio-container-control">
				{ options.map( ( option, index ) =>
					<Button
						key={`${option.label}-${option.value}-${index}`}
						isTertiary={value !== option.value}
						className={'kadence-radio-item radio-' + option.value}
						isPrimary={value === option.value}
						icon={ undefined !== option.icon ? option.icon : undefined }
						aria-pressed={value === option.value}
						onClick={() => onChange( option.value )}
					>
						{option.label}
					</Button>
				)}
			</ButtonGroup>
		</div>
	);
}
