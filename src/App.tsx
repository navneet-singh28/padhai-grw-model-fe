import { useState } from "react";
import {
  Container,
  Stack,
  Group,
  Title,
  Button,
  Table,
  Loader,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

type Metrics = Record<string, number>;

export default function App() {
  const [start, setStart] = useState<string | null>("2025-03-01");
  const [end,   setEnd]   = useState<string | null>("2025-04-20");
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const API = import.meta.env.VITE_API_URL;

  async function run() {
    setLoading(true);
    setMetrics(null);
    try {
      const res = await fetch(`${API}/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start,
          end,
          fetch: true,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMetrics(await res.json());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Title order={1}>Growth-Model Dashboard</Title>

        <Group wrap="wrap">
          <DateInput
            label="Start"
            value={start}
            onChange={setStart}
            valueFormat="YYYY-MM-DD"
            clearable
          />
          <DateInput
            label="End"
            value={end}
            onChange={setEnd}
            valueFormat="YYYY-MM-DD"
            clearable
          />
          <Button onClick={run} loading={loading} disabled={!start || !end}>
            Run
          </Button>
        </Group>

        {loading && (
          <Group justify="center">
            <Loader />
            <Text>Computing... Might take about a minute</Text>
          </Group>
        )}

        {metrics && (
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(metrics).map(([k, v]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td>{v.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Stack>
    </Container>
  );
}