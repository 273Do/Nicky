import type { SFSymbol } from "sf-symbols-typescript";

export type TemplateObj = {
  id: string;
  name: string;
  icon: SFSymbol;
  color: string;
  count: number;
};

export const TEMPLATE: TemplateObj[] = [
  {
    id: "1",
    name: "Morning Routine",
    icon: "sun.max.fill",
    color: "#FF9F0A",
    count: 12,
  },
  { id: "2", name: "Work Timer", icon: "timer", color: "#0A84FF", count: 5 },
  {
    id: "3",
    name: "Text Home",
    icon: "message.fill",
    color: "#30D158",
    count: 8,
  },
  {
    id: "4",
    name: "Play Music",
    icon: "music.note",
    color: "#BF5AF2",
    count: 3,
  },
  {
    id: "5",
    name: "Set Alarm",
    icon: "alarm.fill",
    color: "#FF375F",
    count: 20,
  },
  {
    id: "6",
    name: "Location",
    icon: "location.fill",
    color: "#5E5CE6",
    count: 1,
  },
  {
    id: "7",
    name: "Log Water",
    icon: "drop.fill",
    color: "#32ADE6",
    count: 15,
  },
  {
    id: "8",
    name: "Focus Mode",
    icon: "moon.fill",
    color: "#636366",
    count: 7,
  },
];
