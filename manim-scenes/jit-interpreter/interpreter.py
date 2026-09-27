"""
Manim scene illustrating interpreted execution, based on the article
posts/2026/software-runtimes-aot-jit.md

Focused on: a runtime engine that goes over high-level source code,
line by line, interpreting and executing it directly -- no separate
compiled machine code, unlike the AOT-compiled scene.

Render with (LaTeX must be on PATH, e.g. `export PATH="/Library/TeX/texbin:$PATH"`):
    manim -qm interpreter.py InterpretedExecution
"""
from manim import *
import re

SRC_LINES = [
    "function sumSquares(n) {",
    "  let total = 0;",
    "  for (let i = 0; i < n; i++) {",
    "    total += i * i;",
    "  }",
    "  return total;",
    "}",
]

KEYWORD_COLOR = "#F1C40F"   # yellow-ish for keywords
VAR_COLOR = "#3498DB"       # blue-ish for variables

KEYWORD_WORDS = ("function", "let", "for", "return")
VAR_WORDS = ("sumSquares", "total", "i", "n")


def BTex(text, **kwargs):
    """Bold LaTeX text (Computer Modern via the system's LaTeX + dvisvgm)."""
    return Tex(rf"\textbf{{{text}}}", **kwargs)


class InterpretedExecution(Scene):
    def construct(self):
        self.show_source()
        self.highlight_keywords_variables()
        self.interpreter_loop()

    # ------------------------------------------------------------------
    def show_source(self):
        heading = BTex("High-level source code", font_size=30).to_edge(UP)
        self.play(FadeIn(heading, shift=DOWN))

        src_group = self.build_source_block()
        src_group.scale(1.1)
        src_group.move_to(ORIGIN)

        self.play(FadeIn(src_group, shift=UP))
        self.wait(1)

        self.src_group = src_group
        self.src_heading = heading

    def build_source_block(self):
        """Builds the source listing as individual, pre-colored Text mobjects
        per line (keywords/variables colored from the start). Leading spaces
        produce no glyphs in a Text mobject (so its bounding box always
        starts at the first visible character) -- left-arranging would
        therefore erase any indentation. We strip leading spaces before
        building each line, then shift each line right by
        (leading-space count * monospace char width) after arranging, to
        reproduce the original indentation."""
        font_size = 28
        char_width = self.monospace_char_width(font_size)

        indents = []
        texts = []
        for raw in SRC_LINES:
            stripped = raw.lstrip(" ")
            indents.append(len(raw) - len(stripped))
            texts.append(self.colored_src_line(stripped, font_size))

        lines = VGroup(*texts)
        lines.arrange(DOWN, aligned_edge=LEFT, buff=0.1)
        for line, indent in zip(lines, indents):
            line.shift(RIGHT * indent * char_width)

        box = SurroundingRectangle(lines, color=GRAY_D, buff=0.35, corner_radius=0.1)
        return VGroup(box, lines)

    def monospace_char_width(self, font_size):
        """Measures the per-character width of the monospace font at the
        given size, used to manually reproduce leading-space indentation
        (see build_source_block)."""
        short = Text("M" * 4, font="Monospace", font_size=font_size)
        long = Text("M" * 12, font="Monospace", font_size=font_size)
        return (long.width - short.width) / 8

    def colored_src_line(self, raw, font_size=28):
        """Colors keywords/variables by slicing the plain Text mobject at
        whole-word boundaries. Text() strips whitespace from its internal
        `.text`/submobjects, so we map raw-string match indices (which do
        include spaces) to the stripped submobject indices before slicing."""
        text = Text(raw, font="Monospace", font_size=font_size)
        raw_to_stripped = {}
        stripped_idx = 0
        for raw_idx, ch in enumerate(raw):
            if not ch.isspace():
                raw_to_stripped[raw_idx] = stripped_idx
                stripped_idx += 1

        for words, color in ((KEYWORD_WORDS, KEYWORD_COLOR), (VAR_WORDS, VAR_COLOR)):
            for w in words:
                for m in re.finditer(rf"\b{re.escape(w)}\b", raw):
                    start_raw, end_raw = m.start(), m.end() - 1
                    if start_raw in raw_to_stripped and end_raw in raw_to_stripped:
                        s = raw_to_stripped[start_raw]
                        e = raw_to_stripped[end_raw] + 1
                        text[s:e].set_color(color)
        return text

    # ------------------------------------------------------------------
    def highlight_keywords_variables(self):
        src_group = self.src_group
        box, lines = src_group

        legend_kw = VGroup(
            Square(0.25, fill_color=KEYWORD_COLOR, fill_opacity=1, stroke_width=0),
            Tex("keywords", font_size=22),
        ).arrange(RIGHT, buff=0.2)
        legend_var = VGroup(
            Square(0.25, fill_color=VAR_COLOR, fill_opacity=1, stroke_width=0),
            Tex("variables", font_size=22),
        ).arrange(RIGHT, buff=0.2)
        legend = VGroup(legend_kw, legend_var).arrange(RIGHT, buff=1.0)
        legend.next_to(src_group, DOWN, buff=0.5)

        self.play(FadeIn(legend))
        self.wait(1.5)

        self.play(
            FadeOut(self.src_heading),
            FadeOut(legend),
        )
        self.src_final = VGroup(box, lines)

    # ------------------------------------------------------------------
    def interpreter_loop(self):
        src_group = self.src_final
        self.play(src_group.animate.scale(0.75).to_edge(LEFT, buff=1.0))

        heading = BTex("The runtime: read, interpret, execute -- line by line", font_size=28).to_edge(UP)
        self.play(FadeIn(heading, shift=DOWN))

        # Interpreter loop diagram: 3 stages arranged in a circle
        stages = ["Read", "Interpret", "Execute"]
        stage_mobs = VGroup()
        radius = 1.5
        center = RIGHT * 3.3
        for i, s in enumerate(stages):
            angle = PI / 2 - i * (2 * PI / 3)
            pos = center + radius * np.array([np.cos(angle), np.sin(angle), 0])
            circ = Circle(radius=0.6, color=PURPLE)
            label = Tex(s, font_size=20).move_to(pos)
            circ.move_to(pos)
            stage_mobs.add(VGroup(circ, label))

        loop_arrows = VGroup()
        for i in range(3):
            c1 = stage_mobs[i][0]
            c2 = stage_mobs[(i + 1) % 3][0]
            direction = normalize(c2.get_center() - c1.get_center())
            start = c1.get_center() + direction * c1.radius
            end = c2.get_center() - direction * c2.radius
            arc = CurvedArrow(start, end, angle=-TAU / 8, color=PURPLE_A)
            loop_arrows.add(arc)

        self.play(*[Create(s[0]) for s in stage_mobs], *[FadeIn(s[1]) for s in stage_mobs])
        self.play(*[Create(a) for a in loop_arrows])
        self.wait(0.5)

        # A small "state" box showing variable values as they update
        state_heading = Tex("state", font_size=18, color=GRAY_B)
        state_box = RoundedRectangle(width=2.6, height=1.0, corner_radius=0.1, color=GRAY_B)
        state_text = Tex("total = 0", font_size=22)
        state_group = VGroup(state_box, state_text)
        state_all = VGroup(state_heading, state_group).arrange(DOWN, buff=0.15)
        state_all.next_to(stage_mobs, DOWN, buff=0.9)

        self.play(FadeIn(state_all))

        # Highlight the pointer moving through source lines while loop spins
        box, lines = src_group
        pointer = Arrow(LEFT * 0.6, RIGHT * 0.1, buff=0, color=YELLOW, stroke_width=6)
        pointer.next_to(lines[0], LEFT, buff=0.15)
        self.play(FadeIn(pointer))

        # values of `total` as execution proceeds through key lines
        state_updates = {1: "total = 0", 3: "total = 0 + i*i", 5: "return total"}

        for i in range(len(lines)):
            self.play(
                pointer.animate.next_to(lines[i], LEFT, buff=0.15),
                Indicate(stage_mobs[0], color=PURPLE, scale_factor=1.15),
                run_time=0.35,
            )
            self.play(Indicate(stage_mobs[1], color=PURPLE, scale_factor=1.15), run_time=0.25)
            self.play(Indicate(stage_mobs[2], color=PURPLE, scale_factor=1.15), run_time=0.25)

            if i in state_updates:
                new_text = Tex(state_updates[i], font_size=22).move_to(state_text)
                self.play(Transform(state_text, new_text), run_time=0.3)

        self.wait(1)

        note = BTex(
            "No machine code is produced --- the runtime executes the semantics directly",
            font_size=22,
        ).next_to(src_group, DOWN, buff=0.6).set_color(GRAY_B)
        self.play(FadeIn(note, shift=UP))
        self.wait(2)

        self.play(*[FadeOut(m) for m in self.mobjects])
