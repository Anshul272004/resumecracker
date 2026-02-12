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
  fontFamily?: string;
  setFontFamily?: (v: string) => void;
  fontColor?: string;
  setFontColor?: (v: string) => void;
  headerStyle?: string;
  setHeaderStyle?: (v: string) => void;
}

const colorOptions = [
  { name: "Gold", value: "hsl(43 75% 52%)" },
  { name: "Blue", value: "hsl(215 80% 55%)" },
  { name: "Emerald", value: "hsl(155 70% 45%)" },
  { name: "Rose", value: "hsl(350 70% 55%)" },
  { name: "Purple", value: "hsl(270 70% 55%)" },
  { name: "Slate", value: "hsl(215 15% 45%)" },
  { name: "Teal", value: "hsl(180 70% 45%)" },
  { name: "Coral", value: "hsl(16 80% 60%)" },
  { name: "Navy", value: "hsl(220 60% 35%)" },
];

const fontFamilyOptions = [
  { name: "Serif", value: "'Playfair Display', serif" },
  { name: "Sans-Serif", value: "'Inter', sans-serif" },
  { name: "Monospace", value: "'Courier New', monospace" },
];

const fontColorOptions = [
  { name: "White", value: "hsl(0 0% 100%)" },
  { name: "Light Gray", value: "hsl(0 0% 85%)" },
  { name: "Cream", value: "hsl(40 30% 92%)" },
  { name: "Silver", value: "hsl(0 0% 75%)" },
  { name: "Warm White", value: "hsl(30 20% 95%)" },
  { name: "Cool White", value: "hsl(210 20% 95%)" },
];

const headerStyleOptions = [
  { name: "Left", value: "left" },
  { name: "Center", value: "center" },
  { name: "Two-Col", value: "two-column" },
];

const ResumeCustomizer = ({
  fontSize, setFontSize,
  showPhoto, setShowPhoto,
  showSummary, setShowSummary,
  accentColor, setAccentColor,
  fontFamily, setFontFamily,
  fontColor, setFontColor,
  headerStyle, setHeaderStyle,
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

    {/* Font Family */}
    {setFontFamily && (
      <div>
        <Label className="font-body text-xs text-muted-foreground mb-2 block">Font Family</Label>
        <div className="flex gap-2">
          {fontFamilyOptions.map((f) => (
            <button
              key={f.name}
              onClick={() => setFontFamily(f.value)}
              className={`flex-1 font-body text-[10px] py-2 rounded-lg transition-all ${
                fontFamily === f.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Font Color */}
    {setFontColor && (
      <div>
        <Label className="font-body text-xs text-muted-foreground mb-2 block">Font Color</Label>
        <div className="flex flex-wrap gap-2">
          {fontColorOptions.map((c) => (
            <button
              key={c.name}
              onClick={() => setFontColor(c.value)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                fontColor === c.value ? "border-primary scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
      </div>
    )}

    {/* Header Style */}
    {setHeaderStyle && (
      <div>
        <Label className="font-body text-xs text-muted-foreground mb-2 block">Header Style</Label>
        <div className="flex gap-2">
          {headerStyleOptions.map((h) => (
            <button
              key={h.name}
              onClick={() => setHeaderStyle(h.value)}
              className={`flex-1 font-body text-[10px] py-2 rounded-lg transition-all ${
                headerStyle === h.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {h.name}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Accent color */}
    <div>
      <Label className="font-body text-xs text-muted-foreground mb-2 block">Accent Color</Label>
      <div className="flex flex-wrap gap-2">
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
