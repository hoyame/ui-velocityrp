

export interface IContextMenu {
    name: number;
    condition?: any;
    menu: IContextComponent[];
}

export interface IContextComponent {
    id: number;
    emoji?: string;
    text?: string;
    onClick?: () => void;
}