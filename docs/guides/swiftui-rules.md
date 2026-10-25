# SwiftUI Component Rules

## General

- Always wrap SwiftUI components in `<Host>` with `useViewportSizeMeasurement`
- Use `onTapGesture` modifier for taps — `onPress` prop does NOT work on layout components
- `Button` inside `List` gets a blue tint by default — use `foregroundStyle({ type: "hierarchical", style: "primary" })` to keep the tap highlight without the blue color
- `Button` inside `List` makes the entire row tappable — use `Text` + `onTapGesture` when only the text should be tappable
- `List` manages its own scrolling — never nest it inside `ScrollView`
- Adaptive colors: use `PlatformColor("label")` directly — no need for `useColorScheme`
- `fixedSize()` on a component prevents it from stretching in an HStack, allowing siblings to fill remaining space
- Gradients: `RoundedRectangle` + `foregroundStyle({ type: "linearGradient", ... })` + `clipShape` on parent `ZStack`
- Native navigation bar buttons: use `unstable_headerRightItems` on `Stack.Screen` (not `headerRight` + RN `Pressable`)
- **Never nest RN views (e.g. `Pressable`, `TextInput`) containing SwiftUI children without `<Host>`** — this causes a `SwiftUIVirtualViewException` crash. If you need an RN interactive element alongside SwiftUI content, use SwiftUI's `Button` instead of RN's `Pressable`.

## Embedding RN Views in SwiftUI List

RN native views (e.g. `TextInput`, `AppleMaps.View`, `Markdown`) inside a SwiftUI `List` do **not** auto-size. Use this pattern:

1. Wrap the RN view in a SwiftUI `VStack` + `frame({ height, maxWidth: 9999 })`
2. Measure the RN content height via `onLayout` or `onContentSizeChange`
3. Pass the measured height to `frame({ height })` via state

Example (`InlineMapView`, `MarkdownPreview`):

```tsx
const [contentHeight, setContentHeight] = useState(MIN_HEIGHT);
const onLayout = (e) => setContentHeight(Math.max(MIN_HEIGHT, e.nativeEvent.layout.height));

<VStack modifiers={[frame({ height: contentHeight, maxWidth: 9999 })]}>
  <View onLayout={onLayout}>
    <MyRNComponent />
  </View>
</VStack>;
```

For text-based inputs, calculate height from line count instead of `onLayout`:

```tsx
const calcHeight = (text: string) => Math.max(MIN_HEIGHT, text.split("\n").length * LINE_HEIGHT);
```

## Conditional Layout: List vs VStack

When a screen has two modes (e.g. locked vs unlocked), use `List` for scrollable content and `VStack` for static/centered content. Do not nest lock UI inside `List` as it adds unwanted separators and row styling. Example pattern in `entry-list-view.tsx`:

```tsx
{
  locked ? (
    <VStack modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 })]}>
      <Spacer />
      {/* centered content */}
      <Spacer />
    </VStack>
  ) : (
    <List modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 }), listStyle("plain")]}>
      {/* scrollable list content */}
    </List>
  );
}
```
