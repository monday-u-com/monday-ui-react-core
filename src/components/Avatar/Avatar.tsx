import { camelCase } from "lodash-es";
import { getStyle } from "../../helpers/typesciptCssModulesHelper";
import { ComponentDefaultTestId, getTestId } from "../../tests/test-ids-utils";
import cx from "classnames";
import React, { AriaRole, useCallback, useMemo } from "react";
import { isNil } from "lodash-es";
import { backwardCompatibilityForProperties } from "../../helpers/backwardCompatibilityForProperties";
import { elementColorsNames, getElementColor } from "../../utils/colors-vars-map";
import { AvatarSize, AvatarType } from "./AvatarConstants";
import { AvatarBadge, AvatarBadgeProps } from "./AvatarBadge";
import { AvatarContent } from "./AvatarContent";
import Tooltip, { TooltipProps } from "../Tooltip/Tooltip";
import ClickableWrapper from "../Clickable/ClickableWrapper";
import { SubIcon, VibeComponentProps } from "../../types";
import styles from "./Avatar.module.scss";

type BackgroundColors = typeof elementColorsNames[keyof typeof elementColorsNames];

export interface AvatarProps extends VibeComponentProps {
  src?: string;
  text?: string;
  tooltipProps?: TooltipProps;
  ariaLabel?: string;
  withoutTooltip?: boolean;
  icon?: SubIcon;
  type?: AvatarType;
  /** Class name for the avatar content of text type */
  textClassName?: string;
  /** Class name for a div-wrapper of avatar content */
  avatarContentWrapperClassName?: string;
  backgroundColor?: BackgroundColors;
  customBackgroundColor?: string;
  role?: AriaRole;
  size?: AvatarSize;
  customSize?: number;
  tabIndex?: number;
  ariaHidden?: boolean;
  disabled?: boolean;
  isSquare?: boolean;
  isDisabled?: boolean;
  square?: boolean;
  topLeftBadgeProps?: AvatarBadgeProps;
  topRightBadgeProps?: AvatarBadgeProps;
  bottomLeftBadgeProps?: AvatarBadgeProps;
  bottomRightBadgeProps?: AvatarBadgeProps;
  withoutBorder?: boolean;
  onClick?: (event: React.MouseEvent | React.KeyboardEvent, avatarId: string) => void;
}

const Avatar: React.FC<AvatarProps> & {
  types?: typeof AvatarType;
  sizes?: typeof AvatarSize;
  colors?: BackgroundColors;
  backgroundColors?: BackgroundColors;
} = ({
  id,
  type = AvatarType.TEXT,
  className,
  avatarContentWrapperClassName,
  textClassName = "",
  size = AvatarSize.LARGE,
  src,
  icon,
  text,
  tooltipProps,
  ariaLabel,
  withoutTooltip = false,
  role,
  backgroundColor = elementColorsNames.CHILI_BLUE,
  square,
  disabled,
  // Backward compatibility for props naming
  isSquare,
  // Backward compatibility for props naming
  isDisabled,
  tabIndex = 0,
  ariaHidden = false,
  topLeftBadgeProps,
  topRightBadgeProps,
  bottomLeftBadgeProps,
  bottomRightBadgeProps,
  withoutBorder = false,
  customSize = null,
  customBackgroundColor = null,
  onClick,
  "data-testid": dataTestId
}) => {
  const overrideSquare = backwardCompatibilityForProperties([square, isSquare]);
  const overrideDisabled = backwardCompatibilityForProperties([disabled, isDisabled], false);
  const backgroundColorStyle = useMemo(() => {
    if (customBackgroundColor) return { backgroundColor: customBackgroundColor };
    return src ? {} : { backgroundColor: getElementColor(backgroundColor) };
  }, [src, backgroundColor, customBackgroundColor]);
  const sizeStyle = useMemo(() => {
    return customSize ? { height: customSize, width: customSize } : {};
  }, [customSize]);

  const overrideTooltipProps = useMemo(() => {
    if (withoutTooltip) return undefined;

    if (tooltipProps) {
      return { content: ariaLabel, ...tooltipProps };
    } else {
      return { content: ariaLabel };
    }
  }, [ariaLabel, tooltipProps, withoutTooltip]);

  const badgesContainer = useMemo(() => {
    const badges = [];
    if (!isNil(topLeftBadgeProps)) {
      badges.push(
        <div key="top-left-badge" className={cx(styles.badge, styles.badgeTopLeft)}>
          <AvatarBadge size={size} {...topLeftBadgeProps} />
        </div>
      );
    }
    if (!isNil(topRightBadgeProps)) {
      badges.push(
        <div key="top-right-badge" className={cx(styles.badge, styles.badgeTopRight)}>
          <AvatarBadge size={size} {...topRightBadgeProps} />
        </div>
      );
    }
    if (!isNil(bottomLeftBadgeProps)) {
      badges.push(
        <div key="bottom-left-badge" className={cx(styles.badge, styles.badgeBottomLeft)}>
          <AvatarBadge size={size} {...bottomLeftBadgeProps} />
        </div>
      );
    }
    if (!isNil(bottomRightBadgeProps)) {
      badges.push(
        <div key="bottom-right-bade" className={cx(styles.badge, styles.badgeBottomRight)}>
          <AvatarBadge size={size} {...bottomRightBadgeProps} />
        </div>
      );
    }

    return badges.length > 0 ? <div className={cx(styles.badges)}>{badges}</div> : null;
  }, [size, topLeftBadgeProps, topRightBadgeProps, bottomLeftBadgeProps, bottomRightBadgeProps]);

  const clickHandler = useCallback(
    (event: React.MouseEvent | React.KeyboardEvent) => {
      event.preventDefault();
      if (onClick) {
        onClick(event, id);
      }
    },
    [onClick, id]
  );

  return (
    <div
      id={id}
      data-testid={dataTestId || getTestId(ComponentDefaultTestId.AVATAR, id)}
      className={cx(styles.avatar, styles[size], className)}
      style={sizeStyle}
    >
      <ClickableWrapper
        isClickable={!!onClick}
        clickableProps={{
          onClick: clickHandler,
          tabIndex: "-1",
          className: styles.clickableWrapper
        }}
      >
        <Tooltip
          showTrigger={[Tooltip.hideShowTriggers.FOCUS, Tooltip.hideShowTriggers.MOUSE_ENTER]}
          hideTrigger={[Tooltip.hideShowTriggers.BLUR, Tooltip.hideShowTriggers.MOUSE_LEAVE]}
          {...overrideTooltipProps}
        >
          <div
            className={cx(
              styles.circle,
              getStyle(styles, camelCase("circle--" + type)),
              {
                [styles.disabled]: overrideDisabled,
                [styles.square]: overrideSquare,
                [styles.withoutBorder]: withoutBorder
              },
              avatarContentWrapperClassName
            )}
            aria-hidden={ariaHidden}
            tabIndex={tabIndex}
            style={{ ...backgroundColorStyle }}
          >
            <AvatarContent
              type={type}
              size={size}
              src={src}
              icon={icon}
              text={text}
              ariaLabel={ariaLabel}
              role={role}
              textClassName={textClassName}
            />
          </div>
          {badgesContainer}
        </Tooltip>
      </ClickableWrapper>
    </div>
  );
};

Object.assign(Avatar, {
  types: AvatarType,
  sizes: AvatarSize,
  colors: elementColorsNames,
  backgroundColors: elementColorsNames
});

export default Avatar;
