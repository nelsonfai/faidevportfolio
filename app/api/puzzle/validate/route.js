const PIN = ['8', '1', '3', '5', '6', '2'];

export async function POST(request) {
  try {
    const { values } = await request.json();
    if (!Array.isArray(values) || values.length !== PIN.length || values.some((value) => !/^\d$/.test(value))) {
      return Response.json({ error: 'Expected six single-digit values.' }, { status: 400 });
    }

    const statuses = values.map((value, index) => (
      value === PIN[index] ? 'correct' : PIN.includes(value) ? 'misplaced' : 'incorrect'
    ));

    return Response.json(
      { statuses, solved: statuses.every((status) => status === 'correct') },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
