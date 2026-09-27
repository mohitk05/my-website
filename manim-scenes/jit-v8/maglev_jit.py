"""
Manim scene illustrating Maglev, V8's SSA-based JIT compiler, based on
https://v8.dev/blog/maglev

Covers:
  1. Where Maglev sits among V8's execution tiers (Ignition -> Sparkplug ->
     Maglev -> TurboFan).
  2. How Maglev builds an SSA graph, merging branches with Phi nodes.
  3. Speculative optimization using runtime feedback, with a deopt path
     back to the interpreter when assumptions don't hold.

Render with (LaTeX must be on PATH):
    export PATH="/Library/TeX/texbin:$PATH"
    manim -qh maglev_jit.py MaglevJIT
"""
from manim import *

IGNITION_COLOR = GRAY_B
SPARKPLUG_COLOR = BLUE
MAGLEV_COLOR = "#F1C40F"
TURBOFAN_COLOR = RED

TRUE_COLOR = GREEN
FALSE_COLOR = RED_C


def BTex(text, **kwargs):
    """Bold LaTeX text (Computer Modern via the system's LaTeX + dvisvgm)."""
    return Tex(rf"\textbf{{{text}}}", **kwargs)


def ml_tex(text, buff=0.15, **kwargs):
    """A vertically-stacked, centered multi-line Tex block (split on \\n)."""
    parts = text.split("\n")
    group = VGroup(*[Tex(p, **kwargs) for p in parts])
    group.arrange(DOWN, buff=buff)
    return group


class MaglevJIT(Scene):
    def construct(self):
        self.tier_ladder()
        self.ssa_phi_merge()
        self.speculative_optimization()

    # ------------------------------------------------------------------
    def tier_ladder(self):
        heading = BTex("V8's execution tiers", font_size=32).to_edge(UP)
        self.play(FadeIn(heading, shift=DOWN))

        def make_tier(label, sub, color):
            box = RoundedRectangle(width=2.9, height=1.2, corner_radius=0.15, color=color)
            title = Tex(label, font_size=24).move_to(box.get_center() + UP * 0.18)
            caption = ml_tex(sub, font_size=16, color=GRAY_B).move_to(box.get_center() + DOWN * 0.28)
            return VGroup(box, title, caption)

        ignition = make_tier("Ignition", "interpreter\n(bytecode)", IGNITION_COLOR)
        sparkplug = make_tier("Sparkplug", "baseline JIT\n(fast compile)", SPARKPLUG_COLOR)
        maglev = make_tier("Maglev", "SSA JIT\n(good enough, fast)", MAGLEV_COLOR)
        turbofan = make_tier("TurboFan", "optimizing JIT\n(peak perf)", TURBOFAN_COLOR)

        tiers = VGroup(ignition, sparkplug, maglev, turbofan)
        tiers.arrange(RIGHT, buff=0.55)
        tiers.scale(0.9)
        tiers.move_to(ORIGIN)

        arrows = VGroup(
            *[
                Arrow(tiers[i].get_right(), tiers[i + 1].get_left(), buff=0.08, stroke_width=3)
                for i in range(len(tiers) - 1)
            ]
        )

        self.play(*[Create(t[0]) for t in tiers])
        self.play(*[FadeIn(t[1]) for t in tiers], *[FadeIn(t[2]) for t in tiers])
        self.play(*[GrowArrow(a) for a in arrows])
        self.wait(0.3)

        hotter_arrow = Arrow(
            tiers.get_left() + DOWN * 1.1,
            tiers.get_right() + DOWN * 1.1,
            color=ORANGE,
            stroke_width=3,
        )
        hotter_label = Tex("code gets hotter", font_size=22, color=ORANGE).next_to(
            hotter_arrow, DOWN, buff=0.2
        )
        self.play(GrowArrow(hotter_arrow), FadeIn(hotter_label))
        self.wait(0.5)

        self.play(Indicate(maglev, color=MAGLEV_COLOR, scale_factor=1.12))
        callout = Tex(
            "fills the gap between Sparkplug and TurboFan",
            font_size=22,
            color=MAGLEV_COLOR,
        ).next_to(tiers, UP, buff=0.5)
        self.play(FadeIn(callout, shift=DOWN))
        self.wait(1.5)

        self.play(
            FadeOut(heading),
            FadeOut(ignition),
            FadeOut(sparkplug),
            FadeOut(turbofan),
            FadeOut(arrows),
            FadeOut(hotter_arrow),
            FadeOut(hotter_label),
            FadeOut(callout),
            maglev.animate.scale(0.65).to_edge(UP, buff=0.3),
        )
        self.maglev_box = maglev

    # ------------------------------------------------------------------
    def ssa_phi_merge(self):
        heading = BTex("Building an SSA graph: merging branches with Phi nodes", font_size=26)
        heading.next_to(self.maglev_box, DOWN, buff=0.45)
        self.play(FadeIn(heading, shift=DOWN))

        cond = self.node_box("if (cond)", WHITE)
        true_branch = self.node_box("x = 1", TRUE_COLOR)
        false_branch = self.node_box("x = 2", FALSE_COLOR)
        join = self.node_box(r"join: x = $\varphi$(1, 2)", MAGLEV_COLOR)

        cond.move_to(UP * 1.3)
        true_branch.move_to(LEFT * 2.6)
        false_branch.move_to(RIGHT * 2.6)
        join.move_to(DOWN * 1.3)

        graph = VGroup(cond, true_branch, false_branch, join)
        graph.next_to(heading, DOWN, buff=0.5)

        arrow_t = Arrow(cond.get_bottom(), true_branch.get_top(), buff=0.1, stroke_width=3)
        arrow_f = Arrow(cond.get_bottom(), false_branch.get_top(), buff=0.1, stroke_width=3)
        arrow_tj = Arrow(true_branch.get_bottom(), join.get_top(), buff=0.1, stroke_width=3)
        arrow_fj = Arrow(false_branch.get_bottom(), join.get_top(), buff=0.1, stroke_width=3)

        true_label = Tex("true", font_size=18, color=TRUE_COLOR).next_to(arrow_t, LEFT, buff=0.1)
        false_label = Tex("false", font_size=18, color=FALSE_COLOR).next_to(arrow_f, RIGHT, buff=0.1)

        self.play(FadeIn(cond))
        self.play(GrowArrow(arrow_t), GrowArrow(arrow_f), FadeIn(true_label), FadeIn(false_label))
        self.play(FadeIn(true_branch), FadeIn(false_branch))
        self.play(GrowArrow(arrow_tj), GrowArrow(arrow_fj))
        self.play(FadeIn(join))
        self.wait(0.5)

        explanation = Tex(
            r"$\varphi$ picks the value from whichever path was actually taken at runtime",
            font_size=22,
            color=GRAY_B,
        ).next_to(graph, DOWN, buff=0.5)
        self.play(FadeIn(explanation, shift=UP))
        self.wait(1)

        # Illustrate: at runtime, the true branch was taken
        self.play(arrow_t.animate.set_color(TRUE_COLOR), arrow_tj.animate.set_color(TRUE_COLOR))
        self.play(Indicate(true_branch, color=TRUE_COLOR, scale_factor=1.1))
        resolved = BTex(r"$\varphi$(1, 2) $\to$ 1", font_size=24, color=TRUE_COLOR).next_to(
            join, RIGHT, buff=0.4
        )
        self.play(FadeIn(resolved, shift=LEFT))
        self.wait(2)

        self.play(
            FadeOut(heading),
            FadeOut(graph),
            FadeOut(arrow_t),
            FadeOut(arrow_f),
            FadeOut(arrow_tj),
            FadeOut(arrow_fj),
            FadeOut(true_label),
            FadeOut(false_label),
            FadeOut(explanation),
            FadeOut(resolved),
        )

    def node_box(self, label, color):
        box = RoundedRectangle(width=2.6, height=0.85, corner_radius=0.12, color=color)
        text = Tex(label, font_size=22).move_to(box)
        return VGroup(box, text)

    # ------------------------------------------------------------------
    def speculative_optimization(self):
        heading = BTex("Speculative optimization, with a deopt safety net", font_size=26)
        heading.next_to(self.maglev_box, DOWN, buff=0.45)
        self.play(FadeIn(heading, shift=DOWN))

        access = self.node_box("o.x", WHITE)
        check = self.diamond_box("shape(o) == S?", MAGLEV_COLOR)
        fast = self.node_box("LoadField (fast)", TRUE_COLOR)
        machine = self.node_box("machine code", MAGLEV_COLOR)
        deopt = self.node_box("Deoptimize", FALSE_COLOR)

        access.move_to(UP * 1.7)
        check.move_to(UP * 0.35)
        fast.move_to(DOWN * 1.0 + LEFT * 2.6)
        deopt.move_to(DOWN * 1.0 + RIGHT * 2.6)
        machine.move_to(DOWN * 2.3 + LEFT * 2.6)

        group = VGroup(access, check, fast, deopt, machine)
        group.next_to(heading, DOWN, buff=0.4)

        arrow1 = Arrow(access.get_bottom(), check.get_top(), buff=0.1, stroke_width=3)
        arrow_yes = Arrow(check.get_left(), fast.get_top(), buff=0.1, stroke_width=3, color=TRUE_COLOR)
        arrow_no = Arrow(check.get_right(), deopt.get_top(), buff=0.1, stroke_width=3, color=FALSE_COLOR)
        arrow2 = Arrow(fast.get_bottom(), machine.get_top(), buff=0.1, stroke_width=3)

        yes_label = Tex("yes", font_size=18, color=TRUE_COLOR).next_to(arrow_yes, LEFT, buff=0.08)
        no_label = Tex("no", font_size=18, color=FALSE_COLOR).next_to(arrow_no, RIGHT, buff=0.08)

        self.play(FadeIn(access))
        self.play(GrowArrow(arrow1), FadeIn(check))
        self.wait(0.3)
        self.play(
            GrowArrow(arrow_yes), FadeIn(yes_label),
            GrowArrow(arrow_no), FadeIn(no_label),
        )
        self.play(FadeIn(fast), FadeIn(deopt))
        self.play(GrowArrow(arrow2), FadeIn(machine))
        self.wait(1)

        # Deopt path curves back up to the interpreter tier
        deopt_arrow = CurvedArrow(
            deopt.get_right() + RIGHT * 0.05,
            self.maglev_box.get_right() + RIGHT * 0.4,
            angle=-TAU / 5, color=FALSE_COLOR, stroke_width=3,
        )
        back_label = ml_tex(
            "falls back to the\nbytecode interpreter",
            font_size=18,
            color=FALSE_COLOR,
        ).next_to(deopt, DOWN, buff=0.3).shift(RIGHT * 0.2)

        self.play(Create(deopt_arrow), FadeIn(back_label))
        self.wait(2)

        self.play(*[FadeOut(m) for m in self.mobjects])

    def diamond_box(self, label, color, width=3.2, height=1.4):
        hw, hh = width / 2, height / 2
        diamond = Polygon(UP * hh, RIGHT * hw, DOWN * hh, LEFT * hw, color=color)
        text = Tex(label, font_size=18).move_to(diamond)
        return VGroup(diamond, text)
