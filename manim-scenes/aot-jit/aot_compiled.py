"""
Manim scene illustrating AOT-compiled systems, based on the article
posts/2026/software-runtimes-aot-jit.md

Focused on: the compiled x86-64 assembly and the CPU's fetch-execute loop.

Render with (LaTeX must be on PATH, e.g. `export PATH="/Library/TeX/texbin:$PATH"`):
    manim -qm aot_compiled.py AOTCompiledSystems
"""
from manim import *

ASM_LINES = [
    "square:",
    "push    rbp",
    "mov     rbp, rsp",
    "mov     DWORD PTR [rbp-4], edi",
    "mov     eax, DWORD PTR [rbp-4]",
    "imul    eax, eax",
    "pop     rbp",
    "ret",
]

INSTR_COLOR = "#F1C40F"   # yellow-ish for instructions
REG_COLOR = "#3498DB"     # blue-ish for registers

INSTR_WORDS = ("push", "mov", "imul", "pop", "ret", "square:")
REG_WORDS = ("rbp", "rsp", "eax", "edi")


def BTex(text, **kwargs):
    """Bold LaTeX text (Computer Modern via the system's LaTeX + dvisvgm)."""
    return Tex(rf"\textbf{{{text}}}", **kwargs)


class AOTCompiledSystems(Scene):
    def construct(self):
        self.show_assembly()
        self.highlight_instructions_registers()
        self.cpu_execution_loop()

    # ------------------------------------------------------------------
    def show_assembly(self):
        heading = BTex("x86-64 assembly of a compiled function", font_size=30).to_edge(UP)
        self.play(FadeIn(heading, shift=DOWN))

        asm_group = self.build_asm_block()
        asm_group.scale(1.1)
        asm_group.move_to(ORIGIN)

        self.play(FadeIn(asm_group, shift=UP))
        self.wait(1)

        self.asm_group = asm_group
        self.asm_heading = heading

    def build_asm_block(self):
        """Builds the assembly listing as individual, pre-colored Text mobjects
        per line (instructions/registers colored from the start), all
        left-aligned at the same indentation level."""
        lines = VGroup(*[self.colored_asm_line(raw) for raw in ASM_LINES])
        lines.arrange(DOWN, aligned_edge=LEFT, buff=0.18)
        box = SurroundingRectangle(lines, color=GRAY_D, buff=0.35, corner_radius=0.1)
        return VGroup(box, lines)

    def colored_asm_line(self, raw, font_size=28):
        t2c = {}
        for w in INSTR_WORDS:
            if w in raw:
                t2c[w] = INSTR_COLOR
        for w in REG_WORDS:
            if w in raw:
                t2c[w] = REG_COLOR
        return Text(raw, font="Monospace", font_size=font_size, t2c=t2c)

    # ------------------------------------------------------------------
    def highlight_instructions_registers(self):
        asm_group = self.asm_group
        box, lines = asm_group

        legend_instr = VGroup(
            Square(0.25, fill_color=INSTR_COLOR, fill_opacity=1, stroke_width=0),
            Tex("instructions", font_size=22),
        ).arrange(RIGHT, buff=0.2)
        legend_reg = VGroup(
            Square(0.25, fill_color=REG_COLOR, fill_opacity=1, stroke_width=0),
            Tex("registers", font_size=22),
        ).arrange(RIGHT, buff=0.2)
        legend = VGroup(legend_instr, legend_reg).arrange(RIGHT, buff=1.0)
        legend.next_to(asm_group, DOWN, buff=0.5)

        self.play(FadeIn(legend))
        self.wait(1.5)

        self.play(
            FadeOut(self.asm_heading),
            FadeOut(legend),
        )
        self.asm_final = VGroup(box, lines)

    # ------------------------------------------------------------------
    def cpu_execution_loop(self):
        asm_group = self.asm_final
        self.play(asm_group.animate.scale(0.75).to_edge(LEFT, buff=1.0))

        heading = BTex("The CPU: an infinite fetch--execute loop", font_size=30).to_edge(UP)
        self.play(FadeIn(heading, shift=DOWN))

        # CPU loop diagram: 4 stages arranged in a circle
        stages = ["Fetch", "Decode", "Execute", "Store"]
        stage_mobs = VGroup()
        radius = 1.6
        center = RIGHT * 3.3
        for i, s in enumerate(stages):
            angle = PI / 2 - i * (2 * PI / 4)
            pos = center + radius * np.array([np.cos(angle), np.sin(angle), 0])
            circ = Circle(radius=0.55, color=PURPLE)
            label = Tex(s, font_size=20).move_to(pos)
            circ.move_to(pos)
            stage_mobs.add(VGroup(circ, label))

        loop_arrows = VGroup()
        for i in range(4):
            c1 = stage_mobs[i][0]
            c2 = stage_mobs[(i + 1) % 4][0]
            direction = normalize(c2.get_center() - c1.get_center())
            start = c1.get_center() + direction * c1.radius
            end = c2.get_center() - direction * c2.radius
            arc = CurvedArrow(start, end, angle=-TAU / 8, color=PURPLE_A)
            loop_arrows.add(arc)

        self.play(*[Create(s[0]) for s in stage_mobs], *[FadeIn(s[1]) for s in stage_mobs])
        self.play(*[Create(a) for a in loop_arrows])
        self.wait(0.5)

        # Highlight the pointer moving through asm lines while loop spins
        box, lines = asm_group
        pointer = Arrow(LEFT * 0.6, RIGHT * 0.1, buff=0, color=YELLOW, stroke_width=6)
        pointer.next_to(lines[0], LEFT, buff=0.15)
        self.play(FadeIn(pointer))

        for i in range(len(lines)):
            self.play(
                pointer.animate.next_to(lines[i], LEFT, buff=0.15),
                Indicate(stage_mobs[0], color=PURPLE, scale_factor=1.15),
                run_time=0.35,
            )
            self.play(Indicate(stage_mobs[1], color=PURPLE, scale_factor=1.15), run_time=0.25)
            self.play(Indicate(stage_mobs[2], color=PURPLE, scale_factor=1.15), run_time=0.25)
            self.play(Indicate(stage_mobs[3], color=PURPLE, scale_factor=1.15), run_time=0.25)

        self.wait(1)

        self.play(
            FadeOut(heading),
            FadeOut(stage_mobs),
            FadeOut(loop_arrows),
            FadeOut(pointer),
            FadeOut(asm_group),
        )
