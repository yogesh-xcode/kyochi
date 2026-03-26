alter table public.therapies
  add column if not exists feedback_schema jsonb;

alter table public.feedback
  add column if not exists feedback_payload jsonb;

with therapy_map(schema_key, schema_json) as (
  values
    ('relaxation', '{"Q1_stress_before":"range","Q1_stress_after":"range","Q2_circulation_improvement":"radio","Q3_rested_score":"range","Q4_therapist_note":"text"}'::jsonb),
    ('destress', '{"Q1_mental_calm_score":"range","Q2_physical_tension_relief":"radio","Q3_energy_before":"range","Q3_energy_after":"range","Q4_peace_contributor":"text"}'::jsonb),
    ('chronic_pain', '{"Q1_pain_area":"multiselect","Q2_pain_before":"range","Q2_pain_after":"range","Q3_mobility_improvement":"radio","Q4_sessions_completed":"dropdown","Q4_cumulative_improvement":"radio"}'::jsonb),
    ('soul_serenity', '{"Q1_mental_stillness":"radio","Q2_emotional_balance_score":"range","Q3_standout_element":"checkbox","Q3_standout_note":"text","Q4_therapist_connection_score":"range"}'::jsonb),
    ('reflexology_detox', '{"Q1_lightness_or_release":"radio","Q2_digestion_energy_change":"radio","Q2_cumulative_score":"range","Q3_refreshed_score":"range","Q4_water_intake":"boolean"}'::jsonb),
    ('face_detox_reflexology', '{"Q1_skin_sensation":"radio","Q2_circulation_glow":"radio","Q3_rejuvenation_score":"range","Q4_combine_next_time":"boolean","Q4_combine_therapy_choice":"dropdown"}'::jsonb),
    ('nasal_reflexology', '{"Q1_breathing_ease":"radio","Q2_sinus_relief":"radio","Q3_respiratory_before":"range","Q3_respiratory_after":"range","Q4_sinus_frequency":"dropdown"}'::jsonb),
    ('vita_flex_mens_health', '{"Q1_vitality_score":"range","Q2_muscle_tension_relief":"radio","Q3_mood_tag":"multiselect","Q4_cumulative_improvement":"radio"}'::jsonb),
    ('femme_cycle', '{"Q1_cramp_hormonal_relief":"radio","Q2_emotional_balance_score":"range","Q3_cycle_compliance":"boolean","Q3_last_cycle_date":"date","Q4_menstrual_regularity_change":"radio"}'::jsonb),
    ('little_feet_children', '{"Q1_child_calm_score":"range","Q2_symptom_relief":"radio","Q3_child_mood_score":"range","Q4_followup_scheduled":"boolean"}'::jsonb)
)
update public.therapies t
set feedback_schema = coalesce(t.feedback_schema, tm.schema_json)
from therapy_map tm
where regexp_replace(lower(t.name), '[^a-z0-9]+', '_', 'g') = tm.schema_key;
