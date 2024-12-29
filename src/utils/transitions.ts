import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';

// Fade transitions
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

// Slide animations
const slideInRight = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const slideOutRight = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;

// Shared overlay styles
const overlayBase = `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
`;

// Close button styles
const closeButtonBase = `
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #4a4a4a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.9em;
  z-index: 1001;

  &:hover {
    background-color: #666;
  }
`;

// Animation durations
export const DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Animation timing functions
export const EASING = {
  EASE_OUT: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  EASE_IN: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  EASE_IN_OUT: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
};

// Animation states
const getOverlayAnimation = (type: 'fade' | 'slide', state: 'entering' | 'exiting') => {
  const animations = {
    fade: {
      entering: css`animation: ${fadeIn} ${DURATION.FAST}ms ${EASING.EASE_OUT} forwards;`,
      exiting: css`animation: ${fadeOut} ${DURATION.FAST}ms ${EASING.EASE_IN} forwards;`
    },
    slide: {
      entering: css`animation: ${slideInRight} ${DURATION.NORMAL}ms ${EASING.EASE_OUT} forwards;`,
      exiting: css`animation: ${slideOutRight} ${DURATION.NORMAL}ms ${EASING.EASE_IN} forwards;`
    }
  };
  return animations[type][state];
};

// Styled components
export const StyledDialogueBox = styled.div<{ isTransitioning: boolean }>`
  ${css`animation: ${fadeIn} ${DURATION.NORMAL}ms ${EASING.EASE_OUT};`}
  pointer-events: ${props => props.isTransitioning ? 'none' : 'auto'};
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 800px;
  
  &.transitioning-enter {
    opacity: 0;
    transform: translateX(100%) translateX(-50%);
  }
  
  &.transitioning-exit {
    opacity: 0;
    transform: translateX(-100%) translateX(-50%);
  }
  
  &.transitioning-enter-active,
  &.transitioning-exit-active {
    transition: opacity ${DURATION.NORMAL}ms ${EASING.EASE_IN_OUT},
                transform ${DURATION.NORMAL}ms ${EASING.EASE_IN_OUT};
  }
`;

export const StyledBacklog = styled.div<{ state: 'entering' | 'exiting' }>`
  ${overlayBase}
  ${props => getOverlayAnimation('fade', props.state)}
`;

export const StyledBacklogClose = styled.button`
  ${closeButtonBase}
`;

export const StyledSave = styled.div<{ state: 'entering' | 'exiting' }>`
  ${overlayBase}
  ${props => getOverlayAnimation('slide', props.state)}
`;

export const StyledSaveClose = styled.button`
  ${closeButtonBase}
`;

export const StyledOptions = styled.div<{ state: 'entering' | 'exiting' }>`
  ${overlayBase}
  ${props => getOverlayAnimation('slide', props.state)}
`;

export const StyledOptionsClose = styled.button`
  ${closeButtonBase}
`;

export const StyledQuit = styled.div<{ state: 'entering' | 'exiting' }>`
  ${overlayBase}
  ${props => getOverlayAnimation('fade', props.state)}
`;

export const StyledQuitClose = styled.button`
  ${closeButtonBase}
`;
