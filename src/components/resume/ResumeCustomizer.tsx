import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface CustomizerProps {
  fontSize: number;
  setFontSize: (v: number) => void;
  showPhoto: boolean;
  setShowPhoto: (v: boolean) => void;
  showSummary: boolean;
  setShowSummary: (v: boolean) => void;
  accentColor: string;
  setAccentColor: (v: string) => void;
}

const colorOptions = [
  { name: "Gold", value: "hsl(43 75% 52%)" },
  { name: "Blue", value: "hsl(215 80% 55%)" },
  { name: "Emerald", value: "hsl(155 70% 45%)" },
  { name: "Rose", value: "hsl(350 70% 55%)" },
  { name: "Purple", value: "hsl(270 70% 55%)" },
  { name: "Slate", value: "hsl(215 15% 45%)" },
];

const ResumeCustomizer = ({
  fontSize, setFontSize,
  showPhoto, setShowPhoto,
  showSummary, setShowSummary,
  accentColor, setAccentColor,
}: CustomizerProps) => (
  <div className="glass rounded-xl p-5 space-y-5">
    <h3 className="font-body text-xs font-bold text-primary uppercase tracking-wider">Customize</h3>

    {/* Font size */}
    <div>
      <Label className="font-body text-xs text-muted-foreground">Font Size: {fontSize}px</Label>
      <Slider
        value={[fontSize]}
        onValueChange={([v]) => setFontSize(v)}
        min={10}
        max={16}
        step={1}
        className="mt-2"
      />
    </div>

    {/* Accent color */}
    <div>
      <Label className="font-body text-xs text-muted-foreground mb-2 block">Accent Color</Label>
      <div className="flex gap-2">
        {colorOptions.map((c) => (
          <button
            key={c.name}
            onClick={() => setAccentColor(c.value)}
            className={`w-7 h-7 rounded-full border-2 transition-all ${
              accentColor === c.value ? "border-foreground scale-110" : "border-transparent"
            }`}
            style={{ backgroundColor: c.value }}
            title={c.name}
          />
        ))}
      </div>
    </div>

    {/* Toggles */}
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="font-body text-xs text-muted-foreground">Show Photo</Label>
        <Switch checked={showPhoto} onCheckedChange={setShowPhoto} />
      </div>
      <div className="flex items-center justify-between">
        <Label className="font-body text-xs text-muted-foreground">Show Summary</Label>
        <Switch checked={showSummary} onCheckedChange={setShowSummary} />
      </div>
    </div>
  </div>
);

export default ResumeCustomizer;
