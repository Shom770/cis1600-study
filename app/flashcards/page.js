import Flashcards from "../../components/Flashcards";

export const metadata = { title: "Flashcards · CIS 1600 Midterm 2" };

export default function Page() {
  return (
    <div className="wrap">
      <div className="page-head">
        <div>
          <h1>Flashcards</h1>
          <p>Say the answer out loud before you flip. Cards you miss go back to box 1 and come up first next round.</p>
        </div>
      </div>
      <Flashcards />
    </div>
  );
}
