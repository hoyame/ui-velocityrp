

export interface IContextMenu {
    name: number;
    condition?: any;
    menu: IContextComponent[];
}

export interface IContextComponent {
    id: number;
    icon?: string;
    text?: string;
    onClick?: () => void;
}