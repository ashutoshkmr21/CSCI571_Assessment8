import { trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

export const SlideInOutAnimation = [
    trigger('slideInOut', [
        state('in', style({ 'opacity': '1', 'visibility': 'visible', transform: 'translateX(0%)'
        })),
        state('out', style({'opacity': '1', 'visibility': 'hidden', transform: 'translateX(100%)'
        })),
        transition('in => out', [group([
            style({right: '100%'}),
            animate('2s ease-in-out', style({
                'opacity': '1'
            })),
            animate('2s ease-in-out', style({
                right: 0
            }))
        ]
        )]),
        transition('out => in', [group([
            style({left: '0%'}),
            animate('2s ease-in-out', style({
                'visibility': 'visible'
            })),
            animate('2s ease-in-out', style({
                left: 0
            })),
            animate('2s ease-in-out', style({
                'opacity': '1'
            }))
        ]
        )])
    ]),
]