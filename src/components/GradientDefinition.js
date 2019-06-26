import React, {PureComponent} from 'react';
import {LinearGradient} from '@vx/gradient';

export default class GradientDefinition extends PureComponent {
    render() {
        return (
            <svg width="1px" height="1px">
                <defs>
                    <LinearGradient
                        id={`gradient`}
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%">
                        <stop
                            offset="0%"
                            stopColor="#f03b20"
                            stopOpacity={0.9}
                        />
                        <stop
                            offset="60%"
                            stopColor="#feb24c"
                            stopOpacity={0.7}
                        />
                        <stop
                            offset="80%"
                            stopColor="#ffeda0"
                            stopOpacity={0.5}
                        />
                    </LinearGradient>
                </defs>
            </svg>
        );
    }
}
